import { corsHeaders, handleCors } from '../_shared/cors.ts';
import { isWhmcsConfigured, getInvoices, getInvoice, addInvoicePayment } from '../_shared/whmcs.ts';
import { mockInvoices, validateSession } from '../_shared/mock-data.ts';

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

  try {
    // GET /list or GET / - List all invoices
    if ((path === '/list' || path === '' || path === '/') && req.method === 'GET') {
      const status = url.searchParams.get('status');
      
      // Require authentication for all modes
      if (!session) {
        return new Response(
          JSON.stringify({ error: 'Authentication required' }),
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      if (MOCK_MODE) {
        let invoices = mockInvoices;
        if (status) {
          invoices = mockInvoices.filter(inv => inv.status === status);
        }
        return new Response(
          JSON.stringify({ invoices, mockMode: true }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const result = await getInvoices(session.clientId, status || undefined) as { invoices?: { invoice?: unknown[] } };
      const invoices = result.invoices?.invoice || [];
      return new Response(
        JSON.stringify({ invoices }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // GET /:id - Get single invoice
    const invoiceMatch = path.match(/^\/(\d+)$/);
    if (invoiceMatch && req.method === 'GET') {
      const invoiceId = parseInt(invoiceMatch[1]);
      
      // Require authentication for all modes
      if (!session) {
        return new Response(
          JSON.stringify({ error: 'Authentication required' }),
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      if (MOCK_MODE) {
        const invoice = mockInvoices.find(inv => inv.id === `INV-00${invoiceId}`) || mockInvoices[0];
        return new Response(
          JSON.stringify({ ...invoice, mockMode: true }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const result = await getInvoice(invoiceId);
      return new Response(
        JSON.stringify(result),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // POST /:id/paylink - Generate payment link
    const paylinkMatch = path.match(/^\/(\d+)\/paylink$/);
    if (paylinkMatch && req.method === 'POST') {
      // Require authentication
      if (!session) {
        return new Response(
          JSON.stringify({ error: 'Authentication required' }),
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const invoiceId = paylinkMatch[1];
      const { gateway } = await req.json();

      if (MOCK_MODE) {
        // Return mock payment URL based on gateway
        let paymentUrl = `/checkout/pay?invoice=${invoiceId}`;
        if (gateway === 'paypal') {
          paymentUrl = `https://sandbox.paypal.com/mock?invoice=${invoiceId}`;
        } else if (gateway === 'stripe') {
          paymentUrl = `/checkout/pay?invoice=${invoiceId}&gateway=stripe`;
        }
        
        return new Response(
          JSON.stringify({ 
            url: paymentUrl, 
            invoiceId,
            mockMode: true 
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Real WHMCS would generate gateway-specific payment link
      return new Response(
        JSON.stringify({ url: `/checkout/pay?invoice=${invoiceId}` }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // POST /:id/mark-paid - Mark invoice as paid (internal use after payment confirmation)
    const markPaidMatch = path.match(/^\/(\d+)\/mark-paid$/);
    if (markPaidMatch && req.method === 'POST') {
      const invoiceId = parseInt(markPaidMatch[1]);
      const { transactionId, gateway, amount } = await req.json();

      if (MOCK_MODE) {
        return new Response(
          JSON.stringify({ 
            success: true,
            invoiceId,
            transactionId,
            message: 'Invoice marked as paid (mock)',
            mockMode: true 
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      if (!transactionId || !gateway) {
        return new Response(
          JSON.stringify({ error: 'Transaction ID and gateway required' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const result = await addInvoicePayment(invoiceId, transactionId, gateway, amount);
      
      if (result.result === 'success') {
        return new Response(
          JSON.stringify({ success: true, invoiceId }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({ error: result.message || 'Failed to mark invoice as paid' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Not found' }),
      { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: unknown) {
    console.error('Invoices error:', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
