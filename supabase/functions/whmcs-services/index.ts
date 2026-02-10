import { getCorsHeaders, handleCors, createCorsResponse, createErrorResponse } from '../_shared/cors.ts';
import { isWhmcsConfigured, getClientsProducts, getClientsProductDetails } from '../_shared/whmcs.ts';
import { mockServices, validateSession } from '../_shared/mock-data.ts';
import { validateId, validateText, validateCancellationType } from '../_shared/validation.ts';

const MOCK_MODE = !isWhmcsConfigured();

Deno.serve(async (req) => {
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  const url = new URL(req.url);
  let path = url.pathname.replace('/whmcs-services', '');

  // Extract path from body if sent via supabase.functions.invoke
  let bodyData: Record<string, unknown> | null = null;
  if (req.method === 'POST') {
    try {
      bodyData = await req.json();
      if (bodyData?.path && typeof bodyData.path === 'string') {
        path = bodyData.path;
      }
    } catch { /* handled per-route */ }
  }

  // Auth check - required for all endpoints
  const authHeader = req.headers.get('Authorization');
  const token = authHeader?.replace('Bearer ', '');
  const session = token ? validateSession(token) : null;

  // All service endpoints require authentication
  if (!session) {
    return createErrorResponse(req, 'Authentication required', 401);
  }

  try {
    // GET /list or GET / - List all services
    if ((path === '/list' || path === '' || path === '/') && req.method === 'GET') {
      if (MOCK_MODE) {
        return createCorsResponse(req, { services: mockServices, mockMode: true });
      }

      const result = await getClientsProducts(session.clientId) as { products?: { product?: unknown[] } };
      const services = result.products?.product || [];
      return createCorsResponse(req, { services });
    }

    // GET /:id - Get single service details
    const serviceMatch = path.match(/^\/(\d+)$/);
    if (serviceMatch && req.method === 'GET') {
      const idValidation = validateId(serviceMatch[1], 'Service ID');
      if (!idValidation.valid) {
        return createErrorResponse(req, idValidation.error!, 400);
      }
      
      const serviceId = idValidation.sanitized as number;

      if (MOCK_MODE) {
        const service = mockServices.find(s => s.id === String(serviceId)) || mockServices[0];
        return createCorsResponse(req, { 
          ...service, 
          description: 'Mock service for demonstration',
          createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          packageId: '123',
          packageName: service?.name || 'Demo Package',
          mockMode: true 
        });
      }

      const result = await getClientsProductDetails(session.clientId, serviceId) as { products?: { product?: unknown[] } };
      const product = result.products?.product?.[0];
      
      if (!product) {
        return createErrorResponse(req, 'Service not found', 404);
      }

      return createCorsResponse(req, product);
    }

    // POST /:id/cancel - Request cancellation
    const cancelMatch = path.match(/^\/(\d+)\/cancel$/);
    if (cancelMatch && req.method === 'POST') {
      const idValidation = validateId(cancelMatch[1], 'Service ID');
      if (!idValidation.valid) {
        return createErrorResponse(req, idValidation.error!, 400);
      }

      let body;
      try {
        body = await req.json();
      } catch {
        return createErrorResponse(req, 'Invalid JSON body', 400);
      }

      const { type, reason } = body;
      
      // Validate cancellation type
      const typeValidation = validateCancellationType(type);
      if (!typeValidation.valid) {
        return createErrorResponse(req, typeValidation.error!, 400);
      }

      // Validate reason
      const reasonValidation = validateText(reason, 'Reason', { required: true, minLength: 10, maxLength: 1000 });
      if (!reasonValidation.valid) {
        return createErrorResponse(req, reasonValidation.error!, 400);
      }

      if (MOCK_MODE) {
        return createCorsResponse(req, { 
          success: true, 
          ticketId: `TKT-${Date.now()}`,
          message: 'Cancellation request submitted (mock)',
          mockMode: true 
        });
      }

      // In real mode, would open a support ticket for cancellation
      return createCorsResponse(req, { 
        success: true, 
        serviceId: idValidation.sanitized, 
        type: typeValidation.sanitized, 
        reason: reasonValidation.sanitized 
      });
    }

    // POST /:id/upgrade - Request upgrade
    const upgradeMatch = path.match(/^\/(\d+)\/upgrade$/);
    if (upgradeMatch && req.method === 'POST') {
      const idValidation = validateId(upgradeMatch[1], 'Service ID');
      if (!idValidation.valid) {
        return createErrorResponse(req, idValidation.error!, 400);
      }

      let body;
      try {
        body = await req.json();
      } catch {
        return createErrorResponse(req, 'Invalid JSON body', 400);
      }

      const { upgradeOptionId } = body;
      
      const upgradeValidation = validateText(upgradeOptionId, 'Upgrade option', { required: true, maxLength: 100 });
      if (!upgradeValidation.valid) {
        return createErrorResponse(req, upgradeValidation.error!, 400);
      }

      if (MOCK_MODE) {
        return createCorsResponse(req, { 
          success: true, 
          orderId: `ORD-${Date.now()}`,
          message: 'Upgrade order created (mock)',
          mockMode: true 
        });
      }

      return createCorsResponse(req, { 
        success: true, 
        serviceId: idValidation.sanitized, 
        upgradeOptionId: upgradeValidation.sanitized 
      });
    }

    // GET /:id/upgrades - Get available upgrades
    const upgradesMatch = path.match(/^\/(\d+)\/upgrades$/);
    if (upgradesMatch && req.method === 'GET') {
      const idValidation = validateId(upgradesMatch[1], 'Service ID');
      if (!idValidation.valid) {
        return createErrorResponse(req, idValidation.error!, 400);
      }

      if (MOCK_MODE) {
        return createCorsResponse(req, { 
          upgrades: [
            { id: 'upgrade-1', name: 'Premium', description: 'Double resources', price: 24.99, priceDifference: 12.99, billingCycle: 'monthly' },
            { id: 'upgrade-2', name: 'Enterprise', description: 'Maximum power', price: 49.99, priceDifference: 37.99, billingCycle: 'monthly' },
          ],
          mockMode: true 
        });
      }

      return createCorsResponse(req, { upgrades: [] });
    }

    return createErrorResponse(req, 'Not found', 404);
  } catch (error: unknown) {
    console.error('Services error:', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    return createErrorResponse(req, message, 500);
  }
});
