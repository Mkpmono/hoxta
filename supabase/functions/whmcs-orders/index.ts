import { getCorsHeaders, handleCors, createCorsResponse, createErrorResponse } from '../_shared/cors.ts';
import { isWhmcsConfigured, addOrder, getOrders } from '../_shared/whmcs.ts';
import { mockOrders, validateSession } from '../_shared/mock-data.ts';
import { validateText, validateBillingCycle, validatePaymentMethod } from '../_shared/validation.ts';

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
  'yearly': 'annually',
};

Deno.serve(async (req) => {
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  const url = new URL(req.url);
  const path = url.pathname.replace('/whmcs-orders', '');

  // Auth check - required for all endpoints
  const authHeader = req.headers.get('Authorization');
  const token = authHeader?.replace('Bearer ', '');
  const session = token ? validateSession(token) : null;

  try {
    // POST /create - Create new order
    if (path === '/create' && req.method === 'POST') {
      let body;
      try {
        body = await req.json();
      } catch {
        return createErrorResponse(req, 'Invalid JSON body', 400);
      }

      const { planId, billingCycle, paymentMethod } = body;

      // Validate planId
      const planValidation = validateText(planId, 'Plan ID', { required: true, maxLength: 100 });
      if (!planValidation.valid) {
        return createErrorResponse(req, planValidation.error!, 400);
      }

      // Validate billing cycle
      const billingValidation = validateBillingCycle(billingCycle);
      if (!billingValidation.valid) {
        return createErrorResponse(req, billingValidation.error!, 400);
      }

      // Validate payment method
      const paymentValidation = validatePaymentMethod(paymentMethod);
      if (!paymentValidation.valid) {
        return createErrorResponse(req, paymentValidation.error!, 400);
      }

      // Check if plan exists in product map
      const whmcsPid = PRODUCT_MAP[planValidation.sanitized as string];
      if (!whmcsPid) {
        return createErrorResponse(req, `Unknown plan: ${planValidation.sanitized}`, 400);
      }

      if (MOCK_MODE) {
        // Mock order creation - allow without auth in mock mode for testing
        const orderId = `ORD-${Date.now()}`;
        const invoiceId = `INV-${Date.now()}`;
        return createCorsResponse(req, {
          success: true,
          orderId,
          invoiceId,
          productId: whmcsPid,
          mockMode: true,
        });
      }

      // Real mode - require authentication
      if (!session) {
        return createErrorResponse(req, 'Authentication required', 401);
      }

      const result = await addOrder({
        clientid: session.clientId,
        pid: whmcsPid,
        billingcycle: BILLING_CYCLE_MAP[billingValidation.sanitized as string] || 'monthly',
        paymentmethod: paymentValidation.sanitized as string,
      });

      if (result.result === 'success') {
        return createCorsResponse(req, {
          success: true,
          orderId: result.orderid,
          invoiceId: result.invoiceid,
          productIds: result.productids,
        });
      }

      return createErrorResponse(req, result.message || 'Order failed', 400);
    }

    // GET /list - Get all orders (requires auth)
    if ((path === '/list' || path === '') && req.method === 'GET') {
      // Require authentication for all modes
      if (!session) {
        return createErrorResponse(req, 'Authentication required', 401);
      }

      if (MOCK_MODE) {
        return createCorsResponse(req, { orders: mockOrders, mockMode: true });
      }

      const result = await getOrders(session.clientId);
      return createCorsResponse(req, { orders: result.orders || [] });
    }

    return createErrorResponse(req, 'Not found', 404);
  } catch (error: unknown) {
    console.error('Orders error:', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    return createErrorResponse(req, message, 500);
  }
});
