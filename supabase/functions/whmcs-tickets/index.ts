import { corsHeaders, handleCors } from '../_shared/cors.ts';
import { isWhmcsConfigured, getTickets, getTicket, openTicket, addTicketReply } from '../_shared/whmcs.ts';
import { mockTickets, validateSession } from '../_shared/mock-data.ts';

const MOCK_MODE = !isWhmcsConfigured();

Deno.serve(async (req) => {
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  const url = new URL(req.url);
  const path = url.pathname.replace('/whmcs-tickets', '');

  // Auth check
  const authHeader = req.headers.get('Authorization');
  const token = authHeader?.replace('Bearer ', '');
  const session = token ? validateSession(token) : null;

  try {
    // GET /list or GET / - List all tickets
    if ((path === '/list' || path === '' || path === '/') && req.method === 'GET') {
      const status = url.searchParams.get('status');
      
      if (MOCK_MODE) {
        let tickets = mockTickets;
        if (status) {
          tickets = mockTickets.filter(t => t.status === status);
        }
        return new Response(
          JSON.stringify({ tickets, mockMode: true }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      if (!session) {
        return new Response(
          JSON.stringify({ error: 'Authentication required' }),
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const result = await getTickets(session.clientId, status || undefined) as { tickets?: { ticket?: unknown[] } };
      const tickets = result.tickets?.ticket || [];
      return new Response(
        JSON.stringify({ tickets }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // POST /new - Create new ticket
    if (path === '/new' && req.method === 'POST') {
      const { departmentId, subject, message, priority, relatedServiceId } = await req.json();

      if (!departmentId || !subject || !message) {
        return new Response(
          JSON.stringify({ error: 'Department, subject, and message required' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      if (MOCK_MODE) {
        const ticketId = `TKT-${Date.now()}`;
        return new Response(
          JSON.stringify({ 
            success: true, 
            ticketId,
            mockMode: true 
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      if (!session) {
        return new Response(
          JSON.stringify({ error: 'Authentication required' }),
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const result = await openTicket({
        clientid: session.clientId,
        deptid: parseInt(departmentId),
        subject,
        message,
        priority: priority || 'Medium',
      });

      if (result.result === 'success') {
        return new Response(
          JSON.stringify({ success: true, ticketId: result.id }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({ error: result.message || 'Failed to create ticket' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // GET /:id - Get single ticket with messages
    const ticketMatch = path.match(/^\/([A-Za-z0-9-]+)$/);
    if (ticketMatch && req.method === 'GET') {
      const ticketId = ticketMatch[1];
      
      if (MOCK_MODE) {
        const ticket = mockTickets.find(t => t.id === ticketId) || mockTickets[0];
        return new Response(
          JSON.stringify({ ...ticket, mockMode: true }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      if (!session) {
        return new Response(
          JSON.stringify({ error: 'Authentication required' }),
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const result = await getTicket(parseInt(ticketId));
      return new Response(
        JSON.stringify(result),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // POST /:id/reply - Reply to ticket
    const replyMatch = path.match(/^\/([A-Za-z0-9-]+)\/reply$/);
    if (replyMatch && req.method === 'POST') {
      const ticketId = replyMatch[1];
      const { message } = await req.json();

      if (!message) {
        return new Response(
          JSON.stringify({ error: 'Message required' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      if (MOCK_MODE) {
        return new Response(
          JSON.stringify({ 
            success: true,
            ticketId,
            mockMode: true 
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      if (!session) {
        return new Response(
          JSON.stringify({ error: 'Authentication required' }),
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const result = await addTicketReply(parseInt(ticketId), message, session.clientId);
      
      if (result.result === 'success') {
        return new Response(
          JSON.stringify({ success: true }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({ error: result.message || 'Failed to add reply' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Not found' }),
      { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: unknown) {
    console.error('Tickets error:', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
