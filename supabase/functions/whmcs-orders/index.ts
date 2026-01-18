import { corsHeaders, handleCors } from '../_shared/cors.ts';
import { isWhmcsConfigured, addOrder, getOrders } from '../_shared/whmcs.ts';
import { mockOrders, validateSession } from '../_shared/mock-data.ts';

const MOCK_MODE = !isWhmcsConfigured();

// Product ID mapping (from products.ts)
const PRODUCT_MAP: Record<string, number> = {
  'web-starter': 101,
  'web-professional': 102,
  'web-business': 103,
  'web-enterprise': 104,
  'reseller-starter': 201,
  'reseller-business': 202,
  'reseller-pro': 203,
  'reseller-enterprise': 204,
  'vps-basic': 301,
  'vps-standard': 302,
  'vps-advanced': 303,
  'vps-enterprise': 304,
  'dedicated-starter': 401,
  'dedicated-business': 402,
  'dedicated-enterprise': 403,
  // Game servers
  'mc-starter': 501,
  'mc-standard': 502,
  'mc-premium': 503,
  'mc-enterprise': 504,
  'fivem-starter': 511,
  'fivem-standard': 512,
  'fivem-premium': 513,
  'fivem-enterprise': 514,
  'rust-starter': 521,
  'rust-standard': 522,
  'rust-premium': 523,
  'rust-enterprise': 524,
  // Add more as needed
};

const BILLING_CYCLE_MAP: Record<string, string> = {
  'monthly': 'monthly',
  'quarterly': 'quarterly',
  'annually': 'annually',
};

Deno.serve(async (req) => {
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  const url = new URL(req.url);
  const path = url.pathname.replace('/whmcs-orders', '');

  // Auth check
  const authHeader = req.headers.get('Authorization');
  const token = authHeader?.replace('Bearer ', '');
  const session = token ? validateSession(token) : null;

  try {
    // POST /create - Create new order
    if (path === '/create' && req.method === 'POST') {
      const { planId, billingCycle, paymentMethod } = await req.json();

      if (!planId || !billingCycle) {
        return new Response(
          JSON.stringify({ error: 'Plan ID and billing cycle required' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const whmcsPid = PRODUCT_MAP[planId];
      if (!whmcsPid) {
        return new Response(
          JSON.stringify({ error: `Unknown plan: ${planId}` }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      if (MOCK_MODE) {
        // Mock order creation
        const orderId = `ORD-${Date.now()}`;
        const invoiceId = `INV-${Date.now()}`;
        return new Response(
          JSON.stringify({
            success: true,
            orderId,
            invoiceId,
            productId: whmcsPid,
            mockMode: true,
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Real WHMCS order
      if (!session) {
        return new Response(
          JSON.stringify({ error: 'Authentication required' }),
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const result = await addOrder({
        clientid: session.clientId,
        pid: whmcsPid,
        billingcycle: BILLING_CYCLE_MAP[billingCycle] || 'monthly',
        paymentmethod: paymentMethod || 'stripe',
      });

      if (result.result === 'success') {
        return new Response(
          JSON.stringify({
            success: true,
            orderId: result.orderid,
            invoiceId: result.invoiceid,
            productIds: result.productids,
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({ error: result.message || 'Order failed' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // GET /list - Get all orders
    if ((path === '/list' || path === '') && req.method === 'GET') {
      // Require authentication for all modes
      if (!session) {
        return new Response(
          JSON.stringify({ error: 'Authentication required' }),
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      if (MOCK_MODE) {
        return new Response(
          JSON.stringify({ orders: mockOrders, mockMode: true }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const result = await getOrders(session.clientId);
      return new Response(
        JSON.stringify({ orders: result.orders || [] }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Not found' }),
      { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: unknown) {
    console.error('Orders error:', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
