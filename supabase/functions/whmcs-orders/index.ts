import { handleCors, createCorsResponse, createErrorResponse } from '../_shared/cors.ts';
import { addOrder, getOrders } from '../_shared/whmcs.ts';
import { validateText, validateBillingCycle, validatePaymentMethod } from '../_shared/validation.ts';
import { validateSession, getTokenFromRequest } from '../_shared/jwt.ts';
import { rateLimit } from '../_shared/rate-limit.ts';
import { PRODUCT_MAP, BILLING_CYCLE_MAP, getWhmcsPid, isValidPlanId } from '../_shared/products.ts';

Deno.serve(async (req) => {
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  const url = new URL(req.url);
  let path = url.pathname.replace('/whmcs-orders', '');

  let bodyData: Record<string, unknown> | null = null;
  if (req.method === 'POST') {
    try {
      bodyData = await req.json();
      if (bodyData?.path && typeof bodyData.path === 'string') {
        path = bodyData.path;
      }
    } catch { /* handled per-route */ }
  }

  try {
    // POST /create - Create new order
    if (path === '/create' && req.method === 'POST') {
      const rateLimitResponse = rateLimit(req, 'order');
      if (rateLimitResponse) return rateLimitResponse;

      const token = getTokenFromRequest(req);
      const session = token ? await validateSession(token) : null;

      if (!session) {
        return createErrorResponse(req, 'Authentication required for orders', 401);
      }

      const body = bodyData;
      if (!body) {
        return createErrorResponse(req, 'Invalid JSON body', 400);
      }

      const { planId, billingCycle, paymentMethod } = body as {
        planId: string;
        billingCycle: string;
        paymentMethod: string;
      };

      const planValidation = validateText(planId, 'Plan ID', { required: true, maxLength: 100 });
      if (!planValidation.valid) {
        return createErrorResponse(req, planValidation.error!, 400);
      }

      const sanitizedPlanId = planValidation.sanitized as string;

      if (!isValidPlanId(sanitizedPlanId)) {
        return createErrorResponse(req, `Unknown plan: ${sanitizedPlanId}`, 400);
      }

      const billingValidation = validateBillingCycle(billingCycle);
      if (!billingValidation.valid) {
        return createErrorResponse(req, billingValidation.error!, 400);
      }

      const paymentValidation = validatePaymentMethod(paymentMethod);
      if (!paymentValidation.valid) {
        return createErrorResponse(req, paymentValidation.error!, 400);
      }

      const whmcsPid = getWhmcsPid(sanitizedPlanId);
      const productInfo = PRODUCT_MAP[sanitizedPlanId];

      const result = await addOrder({
        clientid: session.clientId,
        pid: whmcsPid!,
        billingcycle: BILLING_CYCLE_MAP[billingValidation.sanitized as string] || 'monthly',
        paymentmethod: paymentValidation.sanitized as string,
      });

      if (result.result === 'success') {
        return createCorsResponse(req, {
          success: true,
          orderId: result.orderid,
          invoiceId: result.invoiceid,
          productIds: result.productids,
          productName: productInfo?.name,
        });
      }

      return createErrorResponse(req, result.message || 'Order creation failed', 400);
    }

    // GET /list - Get all orders for client
    if ((path === '/list' || path === '') && req.method === 'GET') {
      const token = getTokenFromRequest(req);
      const session = token ? await validateSession(token) : null;

      if (!session) {
        return createErrorResponse(req, 'Authentication required', 401);
      }

      const result = await getOrders(session.clientId);
      return createCorsResponse(req, { 
        orders: result.orders || [],
      });
    }

    return createErrorResponse(req, 'Not found', 404);
  } catch (error: unknown) {
    console.error('Orders error:', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    return createErrorResponse(req, message, 500);
  }
});
