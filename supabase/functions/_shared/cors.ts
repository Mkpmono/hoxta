/**
 * CORS headers for Edge Functions with security hardening
 * Only allows requests from trusted origins
 */

// Allowed origins - add production domains here
const ALLOWED_ORIGINS = [
  'https://hoxta.com',
  'https://www.hoxta.com',
  'https://panel.hoxta.com',
  'https://hoxta.lovable.app',
  'https://id-preview--3c009f31-c1ef-47e9-8a42-d06a347bc20b.lovable.app',
];

// Dev origins (only allowed when DEV_MODE is set)
const DEV_ORIGINS = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
];

const DEV_MODE = Deno.env.get('DEV_MODE') === 'true' || !Deno.env.get('WHMCS_API_URL');

/**
 * Get CORS headers for a specific origin
 * Returns headers only if origin is allowed
 */
export function getCorsHeaders(origin: string | null): Record<string, string> {
  const allAllowed = DEV_MODE ? [...ALLOWED_ORIGINS, ...DEV_ORIGINS] : ALLOWED_ORIGINS;
  
  // If origin is in the allowed list, return proper CORS headers
  if (origin && allAllowed.includes(origin)) {
    return {
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Max-Age': '86400',
    };
  }
  
  // In dev mode, be more permissive for easier testing
  if (DEV_MODE) {
    return {
      'Access-Control-Allow-Origin': origin || '*',
      'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Max-Age': '86400',
    };
  }
  
  // Return empty headers for unknown origins in production
  return {
    'Access-Control-Allow-Origin': '',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  };
}

/**
 * Legacy static headers for backward compatibility
 * @deprecated Use getCorsHeaders(origin) instead
 */
export const corsHeaders = {
  'Access-Control-Allow-Origin': DEV_MODE ? '*' : 'https://hoxta.com',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
};

/**
 * Handle CORS preflight requests
 */
export function handleCors(req: Request): Response | null {
  const origin = req.headers.get('Origin');
  const headers = getCorsHeaders(origin);
  
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers });
  }
  return null;
}

/**
 * Create response with proper CORS headers based on request origin
 */
export function createCorsResponse(
  req: Request,
  body: unknown,
  status = 200
): Response {
  const origin = req.headers.get('Origin');
  const headers = getCorsHeaders(origin);
  
  return new Response(
    JSON.stringify(body),
    { 
      status, 
      headers: { ...headers, 'Content-Type': 'application/json' } 
    }
  );
}

/**
 * Create error response with proper CORS headers
 */
export function createErrorResponse(
  req: Request,
  error: string,
  status = 400
): Response {
  return createCorsResponse(req, { error }, status);
}
