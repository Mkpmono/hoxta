import { handleCors, createCorsResponse, createErrorResponse } from '../_shared/cors.ts';
import { getInvoices, getInvoice, addInvoicePayment } from '../_shared/whmcs.ts';
import { validateId, validateText, validatePaymentMethod, validateAmount } from '../_shared/validation.ts';
import { validateSession, getTokenFromRequest } from '../_shared/jwt.ts';

Deno.serve(async (req) => {
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  const url = new URL(req.url);
  let path = url.pathname.replace('/whmcs-invoices', '');

  let bodyData: Record<string, unknown> | null = null;
  if (req.method === 'POST') {
    try {
      bodyData = await req.json();
      if (bodyData?.path && typeof bodyData.path === 'string') {
        path = bodyData.path;
      }
    } catch { /* handled per-route */ }
  }

  // Auth check
  const token = getTokenFromRequest(req);
  const session = token ? await validateSession(token) : null;

  if (!session) {
    return createErrorResponse(req, 'Authentication required', 401);
  }

  try {
    // GET /list - List all invoices
    if ((path === '/list' || path === '' || path === '/') && req.method === 'GET') {
      const status = url.searchParams.get('status');
      
      if (status) {
        const validStatuses = ['paid', 'unpaid', 'cancelled', 'refunded', 'overdue'];
        if (!validStatuses.includes(status.toLowerCase())) {
          return createErrorResponse(req, `Invalid status. Must be one of: ${validStatuses.join(', ')}`, 400);
        }
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
      const result = await getInvoice(invoiceId);
      return createCorsResponse(req, result);
    }

    // POST /:id/paylink
    const paylinkMatch = path.match(/^\/(\d+)\/paylink$/);
    if (paylinkMatch && req.method === 'POST') {
      const idValidation = validateId(paylinkMatch[1], 'Invoice ID');
      if (!idValidation.valid) {
        return createErrorResponse(req, idValidation.error!, 400);
      }

      const body = bodyData;
      if (!body) {
        return createErrorResponse(req, 'Invalid JSON body', 400);
      }

      const { gateway } = body as { gateway: string };
      
      const gatewayValidation = validatePaymentMethod(gateway);
      if (!gatewayValidation.valid) {
        return createErrorResponse(req, gatewayValidation.error!, 400);
      }

      const invoiceId = idValidation.sanitized;
      return createCorsResponse(req, { url: `/checkout/pay?invoice=${invoiceId}` });
    }

    // POST /:id/mark-paid
    const markPaidMatch = path.match(/^\/(\d+)\/mark-paid$/);
    if (markPaidMatch && req.method === 'POST') {
      const idValidation = validateId(markPaidMatch[1], 'Invoice ID');
      if (!idValidation.valid) {
        return createErrorResponse(req, idValidation.error!, 400);
      }

      const body = bodyData;
      if (!body) {
        return createErrorResponse(req, 'Invalid JSON body', 400);
      }

      const { transactionId, gateway, amount } = body as { transactionId: string; gateway: string; amount?: number };

      const txnValidation = validateText(transactionId, 'Transaction ID', { required: true, minLength: 3, maxLength: 100 });
      if (!txnValidation.valid) {
        return createErrorResponse(req, txnValidation.error!, 400);
      }

      const gatewayValidation = validatePaymentMethod(gateway);
      if (!gatewayValidation.valid) {
        return createErrorResponse(req, gatewayValidation.error!, 400);
      }

      if (amount !== undefined) {
        const amountValidation = validateAmount(amount);
        if (!amountValidation.valid) {
          return createErrorResponse(req, amountValidation.error!, 400);
        }
      }

      const invoiceId = idValidation.sanitized as number;

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
