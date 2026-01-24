/**
 * WHMCS Authentication Edge Function
 * Handles login, registration, session management with httpOnly cookies
 * 
 * Endpoints:
 * POST /login - Authenticate existing user
 * POST /register - Register new client
 * POST /logout - Destroy session
 * GET /me - Get current session
 */

import { handleCors, createCorsResponse, createErrorResponse, getCorsHeaders } from '../_shared/cors.ts';
import { isWhmcsConfigured, validateLogin, addClient, getClientDetails } from '../_shared/whmcs.ts';
import { mockClient } from '../_shared/mock-data.ts';
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

const MOCK_MODE = !isWhmcsConfigured();

// Demo users for development
const DEMO_USERS: Record<string, { password: string; role: 'client' | 'admin' | 'owner' }> = {
  'demo@hoxta.com': { password: 'demo123', role: 'client' },
  'admin@hoxta.com': { password: 'admin123', role: 'admin' },
  'owner@hoxta.com': { password: 'owner123', role: 'owner' },
};

Deno.serve(async (req) => {
  // Handle CORS preflight
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  const url = new URL(req.url);
  const path = url.pathname.replace('/whmcs-auth', '');
  const origin = req.headers.get('Origin');
  const isSecure = origin?.startsWith('https://') || false;

  try {
    // ============================================
    // POST /login - Authenticate existing user
    // ============================================
    if (path === '/login' && req.method === 'POST') {
      // Rate limit auth endpoints
      const rateLimitResponse = rateLimit(req, 'auth');
      if (rateLimitResponse) return rateLimitResponse;

      let body;
      try {
        body = await req.json();
      } catch {
        return createErrorResponse(req, 'Invalid JSON body', 400);
      }

      const { email, password } = body;
      
      // Validate inputs
      const emailValidation = validateEmail(email);
      if (!emailValidation.valid) {
        return createErrorResponse(req, emailValidation.error!, 400);
      }

      if (!password || typeof password !== 'string' || password.length === 0) {
        return createErrorResponse(req, 'Password is required', 400);
      }

      const sanitizedEmail = emailValidation.sanitized as string;

      if (MOCK_MODE) {
        // Check demo users
        const demoUser = DEMO_USERS[sanitizedEmail.toLowerCase()];
        if (demoUser && demoUser.password === password) {
          const token = await createSession(
            1,
            sanitizedEmail,
            'Demo',
            'User',
            demoUser.role
          );

          const headers = new Headers(getCorsHeaders(origin));
          headers.set('Content-Type', 'application/json');
          headers.set('Set-Cookie', createSessionCookie(token, isSecure));

          return new Response(
            JSON.stringify({ 
              success: true,
              client: { 
                id: 1,
                email: sanitizedEmail,
                firstName: mockClient.firstName,
                lastName: mockClient.lastName,
                role: demoUser.role,
              },
              mockMode: true,
            }),
            { headers }
          );
        }

        // Any other email in mock mode - accept with default role
        const token = await createSession(1, sanitizedEmail, 'Mock', 'User', 'client');
        
        const headers = new Headers(getCorsHeaders(origin));
        headers.set('Content-Type', 'application/json');
        headers.set('Set-Cookie', createSessionCookie(token, isSecure));

        return new Response(
          JSON.stringify({ 
            success: true,
            client: { 
              id: 1,
              email: sanitizedEmail,
              firstName: 'Mock',
              lastName: 'User',
              role: 'client',
            },
            mockMode: true,
          }),
          { headers }
        );
      }

      // Real WHMCS login
      const result = await validateLogin(sanitizedEmail, password);
      if (result.result === 'success' && result.userid) {
        // Get client details for session
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

    // ============================================
    // POST /register - Register new client
    // ============================================
    if (path === '/register' && req.method === 'POST') {
      // Rate limit auth endpoints
      const rateLimitResponse = rateLimit(req, 'auth');
      if (rateLimitResponse) return rateLimitResponse;

      let body;
      try {
        body = await req.json();
      } catch {
        return createErrorResponse(req, 'Invalid JSON body', 400);
      }

      const { 
        firstName, lastName, email, companyName,
        address1, city, state, postcode, country, 
        phone, password 
      } = body;

      // Validate all required fields
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

      if (MOCK_MODE) {
        const token = await createSession(
          1,
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
            client: { 
              id: 1,
              email: s.email,
              firstName: s.firstName,
              lastName: s.lastName,
              companyName: s.companyName,
              role: 'client',
            },
            mockMode: true,
          }),
          { headers }
        );
      }

      // Real WHMCS registration
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
        password2: password,
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

    // ============================================
    // POST /logout - Destroy session
    // ============================================
    if (path === '/logout' && req.method === 'POST') {
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

    // ============================================
    // GET /me - Get current session
    // ============================================
    if (path === '/me' && req.method === 'GET') {
      const token = getTokenFromRequest(req);
      
      if (!token) {
        return createErrorResponse(req, 'Unauthorized - no session', 401);
      }

      const session = await validateSession(token);
      if (!session) {
        // Clear invalid cookie
        const headers = new Headers(getCorsHeaders(origin));
        headers.set('Content-Type', 'application/json');
        headers.set('Set-Cookie', createLogoutCookie());

        return new Response(
          JSON.stringify({ error: 'Session expired or invalid' }),
          { status: 401, headers }
        );
      }

      if (MOCK_MODE) {
        return createCorsResponse(req, {
          id: session.clientId,
          email: session.email,
          firstName: session.firstName,
          lastName: session.lastName,
          role: session.role,
          companyName: mockClient.companyName,
          address1: mockClient.address1,
          city: mockClient.city,
          state: mockClient.state,
          postcode: mockClient.postcode,
          country: mockClient.country,
          phone: mockClient.phone,
          mockMode: true,
        });
      }

      // Get full client details from WHMCS
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
