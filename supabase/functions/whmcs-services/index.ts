import { handleCors, createCorsResponse, createErrorResponse } from '../_shared/cors.ts';
import { getClientsProducts, getClientsProductDetails } from '../_shared/whmcs.ts';
import { validateId, validateText, validateCancellationType } from '../_shared/validation.ts';
import { validateSession, getTokenFromRequest } from '../_shared/jwt.ts';

Deno.serve(async (req) => {
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  const url = new URL(req.url);
  let path = url.pathname.replace('/whmcs-services', '');

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
    // GET /list - List all services
    if ((path === '/list' || path === '' || path === '/') && req.method === 'GET') {
      const result = await getClientsProducts(session.clientId) as { products?: { product?: unknown[] } };
      const services = result.products?.product || [];
      return createCorsResponse(req, { services });
    }

    // GET /:id - Get single service
    const serviceMatch = path.match(/^\/(\d+)$/);
    if (serviceMatch && req.method === 'GET') {
      const idValidation = validateId(serviceMatch[1], 'Service ID');
      if (!idValidation.valid) {
        return createErrorResponse(req, idValidation.error!, 400);
      }
      
      const serviceId = idValidation.sanitized as number;
      const result = await getClientsProductDetails(session.clientId, serviceId) as { products?: { product?: unknown[] } };
      const product = result.products?.product?.[0];
      
      if (!product) {
        return createErrorResponse(req, 'Service not found', 404);
      }

      return createCorsResponse(req, product);
    }

    // POST /:id/cancel
    const cancelMatch = path.match(/^\/(\d+)\/cancel$/);
    if (cancelMatch && req.method === 'POST') {
      const idValidation = validateId(cancelMatch[1], 'Service ID');
      if (!idValidation.valid) {
        return createErrorResponse(req, idValidation.error!, 400);
      }

      const body = bodyData;
      if (!body) {
        return createErrorResponse(req, 'Invalid JSON body', 400);
      }

      const { type, reason } = body as { type: string; reason: string };
      
      const typeValidation = validateCancellationType(type);
      if (!typeValidation.valid) {
        return createErrorResponse(req, typeValidation.error!, 400);
      }

      const reasonValidation = validateText(reason, 'Reason', { required: true, minLength: 10, maxLength: 1000 });
      if (!reasonValidation.valid) {
        return createErrorResponse(req, reasonValidation.error!, 400);
      }

      return createCorsResponse(req, { 
        success: true, 
        serviceId: idValidation.sanitized, 
        type: typeValidation.sanitized, 
        reason: reasonValidation.sanitized 
      });
    }

    // POST /:id/upgrade
    const upgradeMatch = path.match(/^\/(\d+)\/upgrade$/);
    if (upgradeMatch && req.method === 'POST') {
      const idValidation = validateId(upgradeMatch[1], 'Service ID');
      if (!idValidation.valid) {
        return createErrorResponse(req, idValidation.error!, 400);
      }

      const body = bodyData;
      if (!body) {
        return createErrorResponse(req, 'Invalid JSON body', 400);
      }

      const { upgradeOptionId } = body as { upgradeOptionId: string };
      
      const upgradeValidation = validateText(upgradeOptionId, 'Upgrade option', { required: true, maxLength: 100 });
      if (!upgradeValidation.valid) {
        return createErrorResponse(req, upgradeValidation.error!, 400);
      }

      return createCorsResponse(req, { 
        success: true, 
        serviceId: idValidation.sanitized, 
        upgradeOptionId: upgradeValidation.sanitized 
      });
    }

    // GET /:id/upgrades
    const upgradesMatch = path.match(/^\/(\d+)\/upgrades$/);
    if (upgradesMatch && req.method === 'GET') {
      const idValidation = validateId(upgradesMatch[1], 'Service ID');
      if (!idValidation.valid) {
        return createErrorResponse(req, idValidation.error!, 400);
      }

      // WHMCS doesn't have a direct "get upgrades" API, return empty for now
      return createCorsResponse(req, { upgrades: [] });
    }

    return createErrorResponse(req, 'Not found', 404);
  } catch (error: unknown) {
    console.error('Services error:', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    return createErrorResponse(req, message, 500);
  }
});
