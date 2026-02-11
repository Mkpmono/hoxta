/**
 * WHMCS Authentication Edge Function
 * Handles login, registration, session management
 * 
 * Endpoints:
 * POST /login - Authenticate existing user
 * POST /register - Register new client
 * POST /logout - Destroy session
 * GET /me - Get current session
 */

import { handleCors, createCorsResponse, createErrorResponse, getCorsHeaders } from '../_shared/cors.ts';
import { validateLogin, addClient, getClientDetails } from '../_shared/whmcs.ts';
import { validateEmail, validatePassword, validateText, validateAll } from '../_shared/validation.ts';
import { 
  createSession, 
  validateSession, 
  destroySession, 
  createSessionCookie, 
  createLogoutCookie,
  getTokenFromRequest,
} from '../_shared/jwt.ts';
import { rateLimit } from '../_shared/rate-limit.ts';

Deno.serve(async (req) => {
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  const url = new URL(req.url);
  const origin = req.headers.get('Origin');
  const isSecure = origin?.startsWith('https://') || false;

  let path = url.pathname.replace('/whmcs-auth', '');
  let bodyData: Record<string, unknown> | null = null;

  if (req.method === 'POST') {
    try {
      bodyData = await req.json();
      if (bodyData?.path && typeof bodyData.path === 'string') {
        path = bodyData.path;
      }
    } catch {
      // Will handle below per-route
    }
  }

  if (req.method === 'GET') {
    const queryPath = url.searchParams.get('path');
    if (queryPath) path = queryPath;
  }

  try {
    // POST /login
    if (path === '/login' && (req.method === 'POST' || bodyData)) {
      const rateLimitResponse = rateLimit(req, 'auth');
      if (rateLimitResponse) return rateLimitResponse;

      const body = bodyData;
      if (!body) {
        return createErrorResponse(req, 'Invalid JSON body', 400);
      }

      const { email, password } = body as { email: string; password: string };
      
      const emailValidation = validateEmail(email);
      if (!emailValidation.valid) {
        return createErrorResponse(req, emailValidation.error!, 400);
      }

      if (!password || typeof password !== 'string' || password.length === 0) {
        return createErrorResponse(req, 'Password is required', 400);
      }

      const sanitizedEmail = emailValidation.sanitized as string;

      const result = await validateLogin(sanitizedEmail, password);
      if (result.result === 'success' && result.userid) {
        const clientDetails = await getClientDetails(Number(result.userid));
        const firstname = (clientDetails.firstname as string) || 'User';
        const lastname = (clientDetails.lastname as string) || '';
        
        const token = await createSession(
          Number(result.userid),
          sanitizedEmail,
          firstname,
          lastname,
          'client'
        );

        const headers = new Headers(getCorsHeaders(origin));
        headers.set('Content-Type', 'application/json');
        headers.set('Set-Cookie', createSessionCookie(token, isSecure));

        return new Response(
          JSON.stringify({ 
            success: true,
            token,
            client: {
              id: result.userid,
              email: sanitizedEmail,
              firstName: firstname,
              lastName: lastname,
              companyName: clientDetails.companyname,
              role: 'client',
            },
          }),
          { headers }
        );
      }
      
      return createErrorResponse(req, 'Invalid email or password', 401);
    }

    // POST /register
    if (path === '/register' && (req.method === 'POST' || bodyData)) {
      const rateLimitResponse = rateLimit(req, 'auth');
      if (rateLimitResponse) return rateLimitResponse;

      const body = bodyData;
      if (!body) {
        return createErrorResponse(req, 'Invalid JSON body', 400);
      }

      const { 
        firstName, lastName, email, companyName,
        address1, city, state, postcode, country, 
        phone, password 
      } = body;

      const validation = validateAll([
        { result: validateEmail(email), fieldName: 'email' },
        { result: validatePassword(password), fieldName: 'password' },
        { result: validateText(firstName, 'First name', { required: true, minLength: 2, maxLength: 50 }), fieldName: 'firstName' },
        { result: validateText(lastName, 'Last name', { required: true, minLength: 2, maxLength: 50 }), fieldName: 'lastName' },
        { result: validateText(companyName, 'Company', { maxLength: 100 }), fieldName: 'companyName' },
        { result: validateText(address1, 'Address', { required: true, maxLength: 200 }), fieldName: 'address1' },
        { result: validateText(city, 'City', { required: true, maxLength: 100 }), fieldName: 'city' },
        { result: validateText(state, 'State', { maxLength: 100 }), fieldName: 'state' },
        { result: validateText(postcode, 'Postcode', { required: true, maxLength: 20 }), fieldName: 'postcode' },
        { result: validateText(country, 'Country', { required: true, minLength: 2, maxLength: 2 }), fieldName: 'country' },
        { result: validateText(phone, 'Phone', { required: true, maxLength: 30 }), fieldName: 'phone' },
      ]);

      if (!validation.valid) {
        return createErrorResponse(req, validation.errors.join(', '), 400);
      }

      const s = validation.sanitized;

      const result = await addClient({
        firstname: s.firstName as string,
        lastname: s.lastName as string,
        email: s.email as string,
        companyname: (s.companyName as string) || '',
        address1: s.address1 as string,
        city: s.city as string,
        state: (s.state as string) || '',
        postcode: s.postcode as string,
        country: s.country as string,
        phonenumber: s.phone as string,
        password2: password as string,
      });

      if (result.result === 'success' && result.clientid) {
        const token = await createSession(
          Number(result.clientid),
          s.email as string,
          s.firstName as string,
          s.lastName as string,
          'client'
        );

        const headers = new Headers(getCorsHeaders(origin));
        headers.set('Content-Type', 'application/json');
        headers.set('Set-Cookie', createSessionCookie(token, isSecure));

        return new Response(
          JSON.stringify({ 
            success: true,
            token,
            client: {
              id: result.clientid,
              email: s.email,
              firstName: s.firstName,
              lastName: s.lastName,
              companyName: s.companyName,
              role: 'client',
            },
          }),
          { headers }
        );
      }

      return createErrorResponse(req, result.message || 'Registration failed', 400);
    }

    // POST /logout
    if (path === '/logout' && (req.method === 'POST' || bodyData)) {
      const token = getTokenFromRequest(req);
      
      if (token) {
        destroySession(token);
      }

      const headers = new Headers(getCorsHeaders(origin));
      headers.set('Content-Type', 'application/json');
      headers.set('Set-Cookie', createLogoutCookie());

      return new Response(
        JSON.stringify({ success: true }),
        { headers }
      );
    }

    // GET /me
    if (path === '/me') {
      const token = getTokenFromRequest(req);
      
      if (!token) {
        return createErrorResponse(req, 'Unauthorized - no session', 401);
      }

      const session = await validateSession(token);
      if (!session) {
        const headers = new Headers(getCorsHeaders(origin));
        headers.set('Content-Type', 'application/json');
        headers.set('Set-Cookie', createLogoutCookie());

        return new Response(
          JSON.stringify({ error: 'Session expired or invalid' }),
          { status: 401, headers }
        );
      }

      const clientDetails = await getClientDetails(session.clientId);
      
      return createCorsResponse(req, {
        id: session.clientId,
        email: session.email,
        firstName: (clientDetails.firstname as string) || session.firstName,
        lastName: (clientDetails.lastname as string) || session.lastName,
        companyName: clientDetails.companyname,
        address1: clientDetails.address1,
        city: clientDetails.city,
        state: clientDetails.state,
        postcode: clientDetails.postcode,
        country: clientDetails.country,
        phone: clientDetails.phonenumber,
        role: session.role,
      });
    }

    return createErrorResponse(req, 'Not found', 404);
  } catch (error: unknown) {
    console.error('Auth error:', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    return createErrorResponse(req, message, 500);
  }
});
