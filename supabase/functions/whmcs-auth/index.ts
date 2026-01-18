import { getCorsHeaders, handleCors, createCorsResponse, createErrorResponse } from '../_shared/cors.ts';
import { isWhmcsConfigured, validateLogin, addClient } from '../_shared/whmcs.ts';
import { mockClient, createSession, validateSession as mockValidateSession, destroySession } from '../_shared/mock-data.ts';
import { validateEmail, validatePassword, validateText, validateAll } from '../_shared/validation.ts';

const MOCK_MODE = !isWhmcsConfigured();

Deno.serve(async (req) => {
  // Handle CORS
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  const url = new URL(req.url);
  const path = url.pathname.replace('/whmcs-auth', '');
  
  try {
    // POST /login
    if (path === '/login' && req.method === 'POST') {
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

      if (MOCK_MODE) {
        // Mock login - accept any credentials
        const token = createSession(1, emailValidation.sanitized as string);
        return createCorsResponse(req, { 
          success: true, 
          token,
          client: { ...mockClient, email: emailValidation.sanitized },
          mockMode: true 
        });
      }

      const result = await validateLogin(emailValidation.sanitized as string, password);
      if (result.result === 'success' && result.userid) {
        const token = createSession(Number(result.userid), emailValidation.sanitized as string);
        return createCorsResponse(req, { success: true, token, clientId: result.userid });
      }
      
      return createErrorResponse(req, 'Invalid credentials', 401);
    }

    // POST /register
    if (path === '/register' && req.method === 'POST') {
      let body;
      try {
        body = await req.json();
      } catch {
        return createErrorResponse(req, 'Invalid JSON body', 400);
      }

      const { firstName, lastName, email, address1, city, state, postcode, country, phone, password } = body;

      // Validate all required fields
      const validation = validateAll([
        { result: validateEmail(email), fieldName: 'email' },
        { result: validatePassword(password), fieldName: 'password' },
        { result: validateText(firstName, 'First name', { required: true, minLength: 2, maxLength: 50 }), fieldName: 'firstName' },
        { result: validateText(lastName, 'Last name', { required: true, minLength: 2, maxLength: 50 }), fieldName: 'lastName' },
        { result: validateText(address1, 'Address', { maxLength: 200 }), fieldName: 'address1' },
        { result: validateText(city, 'City', { maxLength: 100 }), fieldName: 'city' },
        { result: validateText(state, 'State', { maxLength: 100 }), fieldName: 'state' },
        { result: validateText(postcode, 'Postcode', { maxLength: 20 }), fieldName: 'postcode' },
        { result: validateText(country, 'Country', { maxLength: 2 }), fieldName: 'country' },
        { result: validateText(phone, 'Phone', { maxLength: 30 }), fieldName: 'phone' },
      ]);

      if (!validation.valid) {
        return createErrorResponse(req, validation.errors.join(', '), 400);
      }

      if (MOCK_MODE) {
        const token = createSession(1, validation.sanitized.email as string);
        return createCorsResponse(req, { 
          success: true, 
          token,
          clientId: 1,
          client: { ...mockClient, ...validation.sanitized },
          mockMode: true 
        });
      }

      // Real WHMCS registration
      const result = await addClient({
        firstname: validation.sanitized.firstName as string,
        lastname: validation.sanitized.lastName as string,
        email: validation.sanitized.email as string,
        address1: (validation.sanitized.address1 as string) || '',
        city: (validation.sanitized.city as string) || '',
        state: (validation.sanitized.state as string) || '',
        postcode: (validation.sanitized.postcode as string) || '',
        country: (validation.sanitized.country as string) || 'US',
        phonenumber: validation.sanitized.phone as string,
        password2: validation.sanitized.password as string,
      });

      if (result.result === 'success' && result.clientid) {
        const token = createSession(Number(result.clientid), validation.sanitized.email as string);
        return createCorsResponse(req, { success: true, token, clientId: result.clientid });
      }

      return createErrorResponse(req, result.message || 'Registration failed', 400);
    }

    // POST /logout
    if (path === '/logout' && req.method === 'POST') {
      const authHeader = req.headers.get('Authorization');
      const token = authHeader?.replace('Bearer ', '');
      
      if (token) {
        destroySession(token);
      }

      return createCorsResponse(req, { success: true });
    }

    // GET /me - Requires authentication
    if (path === '/me' && req.method === 'GET') {
      const authHeader = req.headers.get('Authorization');
      const token = authHeader?.replace('Bearer ', '');
      
      // Backend auth validation - reject if no token
      if (!token) {
        return createErrorResponse(req, 'Unauthorized - no token provided', 401);
      }

      // Validate session server-side
      const session = mockValidateSession(token);
      if (!session) {
        return createErrorResponse(req, 'Session expired or invalid', 401);
      }

      if (MOCK_MODE) {
        return createCorsResponse(req, { ...mockClient, email: session.email, mockMode: true });
      }

      // Real WHMCS - would call getClientDetails here
      return createCorsResponse(req, { clientId: session.clientId, email: session.email });
    }

    return createErrorResponse(req, 'Not found', 404);
  } catch (error: unknown) {
    console.error('Auth error:', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    return createErrorResponse(req, message, 500);
  }
});
