import { corsHeaders, handleCors } from '../_shared/cors.ts';
import { isWhmcsConfigured, getClientsProducts, getClientsProductDetails } from '../_shared/whmcs.ts';
import { mockServices, validateSession } from '../_shared/mock-data.ts';

const MOCK_MODE = !isWhmcsConfigured();

Deno.serve(async (req) => {
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  const url = new URL(req.url);
  const path = url.pathname.replace('/whmcs-services', '');

  // Auth check
  const authHeader = req.headers.get('Authorization');
  const token = authHeader?.replace('Bearer ', '');
  const session = token ? validateSession(token) : null;

  try {
    // GET /list or GET / - List all services
    if ((path === '/list' || path === '' || path === '/') && req.method === 'GET') {
      // Require authentication for all modes (mock returns demo data for valid sessions)
      if (!session) {
        return new Response(
          JSON.stringify({ error: 'Authentication required' }),
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      if (MOCK_MODE) {
        return new Response(
          JSON.stringify({ services: mockServices, mockMode: true }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const result = await getClientsProducts(session.clientId) as { products?: { product?: unknown[] } };
      const services = result.products?.product || [];
      return new Response(
        JSON.stringify({ services }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // GET /:id - Get single service details
    const serviceMatch = path.match(/^\/(\d+)$/);
    if (serviceMatch && req.method === 'GET') {
      const serviceId = parseInt(serviceMatch[1]);
      
      // Require authentication for all modes
      if (!session) {
        return new Response(
          JSON.stringify({ error: 'Authentication required' }),
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      if (MOCK_MODE) {
        const service = mockServices.find(s => s.id === String(serviceId)) || mockServices[0];
        return new Response(
          JSON.stringify({ 
            ...service, 
            description: 'Mock service for demonstration',
            createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
            packageId: '123',
            packageName: service?.name || 'Demo Package',
            mockMode: true 
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const result = await getClientsProductDetails(serviceId) as { products?: { product?: unknown[] } };
      const product = result.products?.product?.[0];
      
      if (!product) {
        return new Response(
          JSON.stringify({ error: 'Service not found' }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify(product),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // POST /:id/cancel - Request cancellation
    const cancelMatch = path.match(/^\/(\d+)\/cancel$/);
    if (cancelMatch && req.method === 'POST') {
      // Require authentication
      if (!session) {
        return new Response(
          JSON.stringify({ error: 'Authentication required' }),
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const serviceId = cancelMatch[1];
      const { type, reason } = await req.json();

      if (MOCK_MODE) {
        return new Response(
          JSON.stringify({ 
            success: true, 
            ticketId: `TKT-${Date.now()}`,
            message: 'Cancellation request submitted (mock)',
            mockMode: true 
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // In real mode, would open a support ticket for cancellation
      return new Response(
        JSON.stringify({ success: true, serviceId, type, reason }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // POST /:id/upgrade - Request upgrade
    const upgradeMatch = path.match(/^\/(\d+)\/upgrade$/);
    if (upgradeMatch && req.method === 'POST') {
      // Require authentication
      if (!session) {
        return new Response(
          JSON.stringify({ error: 'Authentication required' }),
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const serviceId = upgradeMatch[1];
      const { upgradeOptionId } = await req.json();

      if (MOCK_MODE) {
        return new Response(
          JSON.stringify({ 
            success: true, 
            orderId: `ORD-${Date.now()}`,
            message: 'Upgrade order created (mock)',
            mockMode: true 
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({ success: true, serviceId, upgradeOptionId }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // GET /:id/upgrades - Get available upgrades
    const upgradesMatch = path.match(/^\/(\d+)\/upgrades$/);
    if (upgradesMatch && req.method === 'GET') {
      // Require authentication
      if (!session) {
        return new Response(
          JSON.stringify({ error: 'Authentication required' }),
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      if (MOCK_MODE) {
        return new Response(
          JSON.stringify({ 
            upgrades: [
              { id: 'upgrade-1', name: 'Premium', description: 'Double resources', price: 24.99, priceDifference: 12.99, billingCycle: 'monthly' },
              { id: 'upgrade-2', name: 'Enterprise', description: 'Maximum power', price: 49.99, priceDifference: 37.99, billingCycle: 'monthly' },
            ],
            mockMode: true 
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({ upgrades: [] }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Not found' }),
      { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: unknown) {
    console.error('Services error:', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
