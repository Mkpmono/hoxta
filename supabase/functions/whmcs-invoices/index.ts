import { getCorsHeaders, handleCors, createCorsResponse, createErrorResponse } from '../_shared/cors.ts';
import { isWhmcsConfigured, getInvoices, getInvoice, addInvoicePayment } from '../_shared/whmcs.ts';
import { mockInvoices, validateSession } from '../_shared/mock-data.ts';
import { validateId, validateText, validatePaymentMethod, validateAmount } from '../_shared/validation.ts';

const MOCK_MODE = !isWhmcsConfigured();

Deno.serve(async (req) => {
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  const url = new URL(req.url);
  const path = url.pathname.replace('/whmcs-invoices', '');

  // Auth check
  const authHeader = req.headers.get('Authorization');
  const token = authHeader?.replace('Bearer ', '');
  const session = token ? validateSession(token) : null;

  // All invoice endpoints require authentication
  if (!session) {
    return createErrorResponse(req, 'Authentication required', 401);
  }

  try {
    // GET /list or GET / - List all invoices
    if ((path === '/list' || path === '' || path === '/') && req.method === 'GET') {
      const status = url.searchParams.get('status');
      
      // Validate status if provided
      if (status) {
        const validStatuses = ['paid', 'unpaid', 'cancelled', 'refunded', 'overdue'];
        if (!validStatuses.includes(status.toLowerCase())) {
          return createErrorResponse(req, `Invalid status. Must be one of: ${validStatuses.join(', ')}`, 400);
        }
      }

      if (MOCK_MODE) {
        let invoices = mockInvoices;
        if (status) {
          invoices = mockInvoices.filter(inv => inv.status.toLowerCase() === status.toLowerCase());
        }
        return createCorsResponse(req, { invoices, mockMode: true });
      }

      const result = await getInvoices(session.clientId, status || undefined) as { invoices?: { invoice?: unknown[] } };
      const invoices = result.invoices?.invoice || [];
      return createCorsResponse(req, { invoices });
    }

    // GET /:id - Get single invoice
    const invoiceMatch = path.match(/^\/(\d+)$/);
    if (invoiceMatch && req.method === 'GET') {
      const idValidation = validateId(invoiceMatch[1], 'Invoice ID');
      if (!idValidation.valid) {
        return createErrorResponse(req, idValidation.error!, 400);
      }

      const invoiceId = idValidation.sanitized as number;

      if (MOCK_MODE) {
        const invoice = mockInvoices.find(inv => inv.id === `INV-00${invoiceId}`) || mockInvoices[0];
        return createCorsResponse(req, { ...invoice, mockMode: true });
      }

      const result = await getInvoice(invoiceId);
      return createCorsResponse(req, result);
    }

    // POST /:id/paylink - Generate payment link
    const paylinkMatch = path.match(/^\/(\d+)\/paylink$/);
    if (paylinkMatch && req.method === 'POST') {
      const idValidation = validateId(paylinkMatch[1], 'Invoice ID');
      if (!idValidation.valid) {
        return createErrorResponse(req, idValidation.error!, 400);
      }

      let body;
      try {
        body = await req.json();
      } catch {
        return createErrorResponse(req, 'Invalid JSON body', 400);
      }

      const { gateway } = body;
      
      const gatewayValidation = validatePaymentMethod(gateway);
      if (!gatewayValidation.valid) {
        return createErrorResponse(req, gatewayValidation.error!, 400);
      }

      const invoiceId = idValidation.sanitized;
      const gatewayName = gatewayValidation.sanitized;

      if (MOCK_MODE) {
        // Return mock payment URL based on gateway
        let paymentUrl = `/checkout/pay?invoice=${invoiceId}`;
        if (gatewayName === 'paypal') {
          paymentUrl = `https://sandbox.paypal.com/mock?invoice=${invoiceId}`;
        } else if (gatewayName === 'stripe') {
          paymentUrl = `/checkout/pay?invoice=${invoiceId}&gateway=stripe`;
        }
        
        return createCorsResponse(req, { 
          url: paymentUrl, 
          invoiceId,
          mockMode: true 
        });
      }

      // Real WHMCS would generate gateway-specific payment link
      return createCorsResponse(req, { url: `/checkout/pay?invoice=${invoiceId}` });
    }

    // POST /:id/mark-paid - Mark invoice as paid (internal use after payment confirmation)
    const markPaidMatch = path.match(/^\/(\d+)\/mark-paid$/);
    if (markPaidMatch && req.method === 'POST') {
      const idValidation = validateId(markPaidMatch[1], 'Invoice ID');
      if (!idValidation.valid) {
        return createErrorResponse(req, idValidation.error!, 400);
      }

      let body;
      try {
        body = await req.json();
      } catch {
        return createErrorResponse(req, 'Invalid JSON body', 400);
      }

      const { transactionId, gateway, amount } = body;

      // Validate transaction ID
      const txnValidation = validateText(transactionId, 'Transaction ID', { required: true, minLength: 3, maxLength: 100 });
      if (!txnValidation.valid) {
        return createErrorResponse(req, txnValidation.error!, 400);
      }

      // Validate gateway
      const gatewayValidation = validatePaymentMethod(gateway);
      if (!gatewayValidation.valid) {
        return createErrorResponse(req, gatewayValidation.error!, 400);
      }

      // Validate amount if provided
      if (amount !== undefined) {
        const amountValidation = validateAmount(amount);
        if (!amountValidation.valid) {
          return createErrorResponse(req, amountValidation.error!, 400);
        }
      }

      const invoiceId = idValidation.sanitized as number;

      if (MOCK_MODE) {
        return createCorsResponse(req, { 
          success: true,
          invoiceId,
          transactionId: txnValidation.sanitized,
          message: 'Invoice marked as paid (mock)',
          mockMode: true 
        });
      }

      const result = await addInvoicePayment(
        invoiceId, 
        txnValidation.sanitized as string, 
        gatewayValidation.sanitized as string, 
        amount
      );
      
      if (result.result === 'success') {
        return createCorsResponse(req, { success: true, invoiceId });
      }

      return createErrorResponse(req, result.message || 'Failed to mark invoice as paid', 400);
    }

    return createErrorResponse(req, 'Not found', 404);
  } catch (error: unknown) {
    console.error('Invoices error:', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    return createErrorResponse(req, message, 500);
  }
});
