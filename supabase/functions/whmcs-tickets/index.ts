import { getCorsHeaders, handleCors, createCorsResponse, createErrorResponse } from '../_shared/cors.ts';
import { isWhmcsConfigured, getTickets, getTicket, openTicket, addTicketReply } from '../_shared/whmcs.ts';
import { mockTickets, validateSession } from '../_shared/mock-data.ts';
import { validateId, validateText, validatePriority } from '../_shared/validation.ts';

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

  // All ticket endpoints require authentication
  if (!session) {
    return createErrorResponse(req, 'Authentication required', 401);
  }

  try {
    // GET /list or GET / - List all tickets
    if ((path === '/list' || path === '' || path === '/') && req.method === 'GET') {
      const status = url.searchParams.get('status');
      
      // Validate status if provided
      if (status) {
        const validStatuses = ['open', 'answered', 'customer-reply', 'closed', 'on hold'];
        if (!validStatuses.includes(status.toLowerCase())) {
          return createErrorResponse(req, `Invalid status. Must be one of: ${validStatuses.join(', ')}`, 400);
        }
      }

      if (MOCK_MODE) {
        let tickets = mockTickets;
        if (status) {
          tickets = mockTickets.filter(t => t.status.toLowerCase() === status.toLowerCase());
        }
        return createCorsResponse(req, { tickets, mockMode: true });
      }

      const result = await getTickets(session.clientId, status || undefined) as { tickets?: { ticket?: unknown[] } };
      const tickets = result.tickets?.ticket || [];
      return createCorsResponse(req, { tickets });
    }

    // POST /new - Create new ticket
    if (path === '/new' && req.method === 'POST') {
      let body;
      try {
        body = await req.json();
      } catch {
        return createErrorResponse(req, 'Invalid JSON body', 400);
      }

      const { departmentId, subject, message, priority, relatedServiceId } = body;

      // Validate department ID
      const deptValidation = validateId(departmentId, 'Department ID');
      if (!deptValidation.valid) {
        return createErrorResponse(req, deptValidation.error!, 400);
      }

      // Validate subject
      const subjectValidation = validateText(subject, 'Subject', { required: true, minLength: 3, maxLength: 200 });
      if (!subjectValidation.valid) {
        return createErrorResponse(req, subjectValidation.error!, 400);
      }

      // Validate message
      const messageValidation = validateText(message, 'Message', { required: true, minLength: 10, maxLength: 5000 });
      if (!messageValidation.valid) {
        return createErrorResponse(req, messageValidation.error!, 400);
      }

      // Validate priority
      const priorityValidation = validatePriority(priority);
      if (!priorityValidation.valid) {
        return createErrorResponse(req, priorityValidation.error!, 400);
      }

      if (MOCK_MODE) {
        const ticketId = `TKT-${Date.now()}`;
        return createCorsResponse(req, { 
          success: true, 
          ticketId,
          mockMode: true 
        });
      }

      const priorityMap: Record<string, 'Low' | 'Medium' | 'High'> = {
        'low': 'Low',
        'medium': 'Medium',
        'high': 'High',
      };
      
      const result = await openTicket({
        clientid: session.clientId,
        deptid: deptValidation.sanitized as number,
        subject: subjectValidation.sanitized as string,
        message: messageValidation.sanitized as string,
        priority: priorityMap[priorityValidation.sanitized as string] || 'Medium',
      });

      if (result.result === 'success') {
        return createCorsResponse(req, { success: true, ticketId: result.id });
      }

      return createErrorResponse(req, result.message || 'Failed to create ticket', 400);
    }

    // GET /:id - Get single ticket with messages
    const ticketMatch = path.match(/^\/([A-Za-z0-9-]+)$/);
    if (ticketMatch && req.method === 'GET') {
      const ticketId = ticketMatch[1];
      
      // Validate ticket ID format
      if (ticketId.length > 50) {
        return createErrorResponse(req, 'Invalid ticket ID format', 400);
      }

      if (MOCK_MODE) {
        const ticket = mockTickets.find(t => t.id === ticketId) || mockTickets[0];
        return createCorsResponse(req, { ...ticket, mockMode: true });
      }

      const result = await getTicket(parseInt(ticketId));
      return createCorsResponse(req, result);
    }

    // POST /:id/reply - Reply to ticket
    const replyMatch = path.match(/^\/([A-Za-z0-9-]+)\/reply$/);
    if (replyMatch && req.method === 'POST') {
      const ticketId = replyMatch[1];
      
      // Validate ticket ID format
      if (ticketId.length > 50) {
        return createErrorResponse(req, 'Invalid ticket ID format', 400);
      }

      let body;
      try {
        body = await req.json();
      } catch {
        return createErrorResponse(req, 'Invalid JSON body', 400);
      }

      const { message } = body;

      // Validate message
      const messageValidation = validateText(message, 'Message', { required: true, minLength: 5, maxLength: 5000 });
      if (!messageValidation.valid) {
        return createErrorResponse(req, messageValidation.error!, 400);
      }

      if (MOCK_MODE) {
        return createCorsResponse(req, { 
          success: true,
          ticketId,
          mockMode: true 
        });
      }

      const result = await addTicketReply(parseInt(ticketId), messageValidation.sanitized as string, session.clientId);
      
      if (result.result === 'success') {
        return createCorsResponse(req, { success: true });
      }

      return createErrorResponse(req, result.message || 'Failed to add reply', 400);
    }

    return createErrorResponse(req, 'Not found', 404);
  } catch (error: unknown) {
    console.error('Tickets error:', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    return createErrorResponse(req, message, 500);
  }
});
