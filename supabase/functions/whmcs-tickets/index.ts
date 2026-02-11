import { handleCors, createCorsResponse, createErrorResponse } from '../_shared/cors.ts';
import { getTickets, getTicket, openTicket, addTicketReply } from '../_shared/whmcs.ts';
import { validateId, validateText, validatePriority } from '../_shared/validation.ts';
import { validateSession, getTokenFromRequest } from '../_shared/jwt.ts';

Deno.serve(async (req) => {
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  const url = new URL(req.url);
  let path = url.pathname.replace('/whmcs-tickets', '');

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
    // GET /list - List all tickets
    if ((path === '/list' || path === '' || path === '/') && req.method === 'GET') {
      const status = url.searchParams.get('status');
      
      if (status) {
        const validStatuses = ['open', 'answered', 'customer-reply', 'closed', 'on hold'];
        if (!validStatuses.includes(status.toLowerCase())) {
          return createErrorResponse(req, `Invalid status. Must be one of: ${validStatuses.join(', ')}`, 400);
        }
      }

      const result = await getTickets(session.clientId, status || undefined) as { tickets?: { ticket?: unknown[] } };
      const tickets = result.tickets?.ticket || [];
      return createCorsResponse(req, { tickets });
    }

    // POST /create or /new - Create new ticket
    if ((path === '/create' || path === '/new') && req.method === 'POST') {
      const body = bodyData;
      if (!body) {
        return createErrorResponse(req, 'Invalid JSON body', 400);
      }

      const { departmentId, subject, message, priority } = body as {
        departmentId: string;
        subject: string;
        message: string;
        priority: string;
      };

      const deptValidation = validateId(departmentId, 'Department ID');
      if (!deptValidation.valid) {
        return createErrorResponse(req, deptValidation.error!, 400);
      }

      const subjectValidation = validateText(subject, 'Subject', { required: true, minLength: 3, maxLength: 200 });
      if (!subjectValidation.valid) {
        return createErrorResponse(req, subjectValidation.error!, 400);
      }

      const messageValidation = validateText(message, 'Message', { required: true, minLength: 10, maxLength: 5000 });
      if (!messageValidation.valid) {
        return createErrorResponse(req, messageValidation.error!, 400);
      }

      const priorityValidation = validatePriority(priority);
      if (!priorityValidation.valid) {
        return createErrorResponse(req, priorityValidation.error!, 400);
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

    // POST /:id/reply - Reply to ticket
    const replyMatch = path.match(/^\/([A-Za-z0-9-]+)\/reply$/);
    if (replyMatch && req.method === 'POST') {
      const ticketId = replyMatch[1];
      
      if (ticketId.length > 50) {
        return createErrorResponse(req, 'Invalid ticket ID format', 400);
      }

      const body = bodyData;
      if (!body) {
        return createErrorResponse(req, 'Invalid JSON body', 400);
      }

      const { message } = body as { message: string };

      const messageValidation = validateText(message, 'Message', { required: true, minLength: 5, maxLength: 5000 });
      if (!messageValidation.valid) {
        return createErrorResponse(req, messageValidation.error!, 400);
      }

      const result = await addTicketReply(parseInt(ticketId), messageValidation.sanitized as string, session.clientId);
      
      if (result.result === 'success') {
        return createCorsResponse(req, { success: true });
      }

      return createErrorResponse(req, result.message || 'Failed to add reply', 400);
    }

    // GET /:id - Get single ticket with messages
    const ticketMatch = path.match(/^\/([A-Za-z0-9-]+)$/);
    if (ticketMatch && req.method === 'GET') {
      const ticketId = ticketMatch[1];
      
      if (ticketId.length > 50) {
        return createErrorResponse(req, 'Invalid ticket ID format', 400);
      }

      const result = await getTicket(parseInt(ticketId));
      return createCorsResponse(req, result);
    }

    return createErrorResponse(req, 'Not found', 404);
  } catch (error: unknown) {
    console.error('Tickets error:', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    return createErrorResponse(req, message, 500);
  }
});
