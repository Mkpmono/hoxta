/**
 * WHMCS Orders Edge Function
 * Handles order creation with authentication via httpOnly cookies
 * 
 * Endpoints:
 * POST /create - Create new order (requires auth)
 * GET /list - Get all orders (requires auth)
 * GET /:orderId - Get order details (requires auth)
 */

import { handleCors, createCorsResponse, createErrorResponse } from '../_shared/cors.ts';
import { isWhmcsConfigured, addOrder, getOrders } from '../_shared/whmcs.ts';
import { mockOrders } from '../_shared/mock-data.ts';
import { validateText, validateBillingCycle, validatePaymentMethod } from '../_shared/validation.ts';
import { validateSession, getTokenFromRequest, SessionData } from '../_shared/jwt.ts';
import { rateLimit } from '../_shared/rate-limit.ts';
import { PRODUCT_MAP, BILLING_CYCLE_MAP, getWhmcsPid, isValidPlanId } from '../_shared/products.ts';

const MOCK_MODE = !isWhmcsConfigured();

/**
 * Require authentication middleware
 */
async function requireAuth(req: Request): Promise<SessionData | Response> {
  const token = getTokenFromRequest(req);
  
  if (!token) {
    return createErrorResponse(req, 'Authentication required', 401);
  }

  const session = await validateSession(token);
  if (!session) {
    return createErrorResponse(req, 'Session expired or invalid', 401);
  }

  return session;
}

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
    // ============================================
    // POST /create - Create new order
    // ============================================
    if (path === '/create' && req.method === 'POST') {
      // Rate limit order endpoints
      const rateLimitResponse = rateLimit(req, 'order');
      if (rateLimitResponse) return rateLimitResponse;

      // In mock mode, allow orders without auth for testing
      let session: SessionData | null = null;
      if (!MOCK_MODE) {
        const authResult = await requireAuth(req);
        if (authResult instanceof Response) return authResult;
        session = authResult;
      } else {
        // Try to get session for mock mode (optional)
        const token = getTokenFromRequest(req);
        if (token) {
          session = await validateSession(token);
        }
      }

      let body;
      try {
        body = await req.json();
      } catch {
        return createErrorResponse(req, 'Invalid JSON body', 400);
      }

      const { 
        planId, 
        billingCycle, 
        paymentMethod,
        // Customer data for guest checkout (mock mode only)
        customer,
      } = body;

      // Validate planId
      const planValidation = validateText(planId, 'Plan ID', { required: true, maxLength: 100 });
      if (!planValidation.valid) {
        return createErrorResponse(req, planValidation.error!, 400);
      }

      const sanitizedPlanId = planValidation.sanitized as string;

      // Check if plan exists in product catalog
      if (!isValidPlanId(sanitizedPlanId)) {
        return createErrorResponse(req, `Unknown plan: ${sanitizedPlanId}`, 400);
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

      const whmcsPid = getWhmcsPid(sanitizedPlanId);
      const productInfo = PRODUCT_MAP[sanitizedPlanId];

      if (MOCK_MODE) {
        // Mock order creation
        const orderId = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
        const invoiceId = `INV-${Date.now()}`;
        
        return createCorsResponse(req, {
          success: true,
          orderId,
          invoiceId,
          productId: whmcsPid,
          productName: productInfo?.name,
          billingCycle: billingValidation.sanitized,
          paymentMethod: paymentValidation.sanitized,
          clientId: session?.clientId || 1,
          mockMode: true,
        });
      }

      // Real WHMCS order - requires authenticated session
      if (!session) {
        return createErrorResponse(req, 'Authentication required for orders', 401);
      }

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

    // ============================================
    // GET /list - Get all orders for client
    // ============================================
    if ((path === '/list' || path === '') && req.method === 'GET') {
      const authResult = await requireAuth(req);
      if (authResult instanceof Response) return authResult;
      const session = authResult;

      if (MOCK_MODE) {
        return createCorsResponse(req, { 
          orders: mockOrders,
          mockMode: true,
        });
      }

      const result = await getOrders(session.clientId);
      return createCorsResponse(req, { 
        orders: result.orders || [],
      });
    }

    // ============================================
    // GET /:orderId - Get single order details
    // ============================================
    const orderIdMatch = path.match(/^\/([A-Z0-9-]+)$/i);
    if (orderIdMatch && req.method === 'GET') {
      const authResult = await requireAuth(req);
      if (authResult instanceof Response) return authResult;
      const session = authResult;

      const orderId = orderIdMatch[1];

      if (MOCK_MODE) {
        const order = mockOrders.find(o => o.id === orderId);
        if (!order) {
          return createErrorResponse(req, 'Order not found', 404);
        }
        return createCorsResponse(req, { 
          order,
          mockMode: true,
        });
      }

      // In real mode, would call WHMCS GetOrder
      return createErrorResponse(req, 'Order details not implemented', 501);
    }

    return createErrorResponse(req, 'Not found', 404);
  } catch (error: unknown) {
    console.error('Orders error:', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    return createErrorResponse(req, message, 500);
  }
});
