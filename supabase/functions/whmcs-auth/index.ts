import { corsHeaders, handleCors } from '../_shared/cors.ts';
import { isWhmcsConfigured, validateLogin, addClient } from '../_shared/whmcs.ts';
import { mockClient, createSession, validateSession as mockValidateSession, destroySession } from '../_shared/mock-data.ts';

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
      const { email, password } = await req.json();
      
      if (!email || !password) {
        return new Response(
          JSON.stringify({ error: 'Email and password required' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      if (MOCK_MODE) {
        // Mock login - accept any credentials
        const token = createSession(1, email);
        return new Response(
          JSON.stringify({ 
            success: true, 
            token,
            client: { ...mockClient, email },
            mockMode: true 
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const result = await validateLogin(email, password);
      if (result.result === 'success' && result.userid) {
        const token = createSession(Number(result.userid), email);
        return new Response(
          JSON.stringify({ success: true, token, clientId: result.userid }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      return new Response(
        JSON.stringify({ error: 'Invalid credentials' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // POST /register
    if (path === '/register' && req.method === 'POST') {
      const body = await req.json();
      const { firstName, lastName, email, address1, city, state, postcode, country, phone, password } = body;

      if (!email || !password || !firstName || !lastName) {
        return new Response(
          JSON.stringify({ error: 'Required fields missing' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      if (MOCK_MODE) {
        const token = createSession(1, email);
        return new Response(
          JSON.stringify({ 
            success: true, 
            token,
            clientId: 1,
            client: { ...mockClient, email, firstName, lastName },
            mockMode: true 
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Real WHMCS registration
      const result = await addClient({
        firstname: firstName,
        lastname: lastName,
        email,
        address1: address1 || '',
        city: city || '',
        state: state || '',
        postcode: postcode || '',
        country: country || 'US',
        phonenumber: phone,
        password2: password,
      });

      if (result.result === 'success' && result.clientid) {
        const token = createSession(Number(result.clientid), email);
        return new Response(
          JSON.stringify({ success: true, token, clientId: result.clientid }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({ error: result.message || 'Registration failed' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // POST /logout
    if (path === '/logout' && req.method === 'POST') {
      const authHeader = req.headers.get('Authorization');
      const token = authHeader?.replace('Bearer ', '');
      
      if (token) {
        destroySession(token);
      }

      return new Response(
        JSON.stringify({ success: true }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // GET /me
    if (path === '/me' && req.method === 'GET') {
      const authHeader = req.headers.get('Authorization');
      const token = authHeader?.replace('Bearer ', '');
      
      if (!token) {
        return new Response(
          JSON.stringify({ error: 'Unauthorized' }),
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const session = mockValidateSession(token);
      if (!session) {
        return new Response(
          JSON.stringify({ error: 'Session expired' }),
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      if (MOCK_MODE) {
        return new Response(
          JSON.stringify({ ...mockClient, email: session.email, mockMode: true }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Real WHMCS - would call getClientDetails here
      return new Response(
        JSON.stringify({ clientId: session.clientId, email: session.email }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Not found' }),
      { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: unknown) {
    console.error('Auth error:', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
