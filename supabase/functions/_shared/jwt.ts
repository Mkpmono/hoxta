/**
 * JWT Utilities for Authentication
 * Handles JWT creation, validation, and httpOnly cookie management
 * 
 * SECURITY: All JWT secrets are server-side only, never exposed to frontend
 */

// Get JWT secret from environment (server-side only)
const JWT_SECRET = Deno.env.get('JWT_SECRET') || 'dev-secret-change-in-production-' + Date.now();
const JWT_EXPIRY_DAYS = 7;
const COOKIE_NAME = 'hoxta_session';

// Session storage (in production, use Redis/KV store)
const sessions = new Map<string, SessionData>();

export interface SessionData {
  clientId: number;
  email: string;
  firstName: string;
  lastName: string;
  role: 'client' | 'admin' | 'owner';
  expiresAt: number;
}

export interface JWTPayload {
  sub: string; // clientId
  email: string;
  firstName: string;
  lastName: string;
  role: 'client' | 'admin' | 'owner';
  iat: number;
  exp: number;
}

/**
 * Base64url encode
 */
function base64urlEncode(data: string | Uint8Array): string {
  const str = typeof data === 'string' ? data : new TextDecoder().decode(data);
  const base64 = btoa(str);
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

/**
 * Base64url decode
 */
function base64urlDecode(str: string): string {
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  const padding = base64.length % 4;
  if (padding) {
    base64 += '='.repeat(4 - padding);
  }
  return atob(base64);
}

/**
 * Create HMAC-SHA256 signature
 */
async function createSignature(data: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(JWT_SECRET),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(data));
  return base64urlEncode(new Uint8Array(signature).reduce((s, b) => s + String.fromCharCode(b), ''));
}

/**
 * Verify HMAC-SHA256 signature
 */
async function verifySignature(data: string, signature: string): Promise<boolean> {
  const expectedSignature = await createSignature(data);
  
  // Timing-safe comparison
  if (expectedSignature.length !== signature.length) return false;
  let result = 0;
  for (let i = 0; i < expectedSignature.length; i++) {
    result |= expectedSignature.charCodeAt(i) ^ signature.charCodeAt(i);
  }
  return result === 0;
}

/**
 * Create JWT token
 */
export async function createJWT(payload: Omit<JWTPayload, 'iat' | 'exp'>): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const fullPayload: JWTPayload = {
    ...payload,
    iat: now,
    exp: now + (JWT_EXPIRY_DAYS * 24 * 60 * 60),
  };

  const header = base64urlEncode(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const body = base64urlEncode(JSON.stringify(fullPayload));
  const signature = await createSignature(`${header}.${body}`);

  return `${header}.${body}.${signature}`;
}

/**
 * Verify and decode JWT token
 */
export async function verifyJWT(token: string): Promise<JWTPayload | null> {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const [header, body, signature] = parts;
    
    // Verify signature
    const isValid = await verifySignature(`${header}.${body}`, signature);
    if (!isValid) return null;

    // Decode payload
    const payload: JWTPayload = JSON.parse(base64urlDecode(body));

    // Check expiration
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp < now) return null;

    return payload;
  } catch {
    return null;
  }
}

/**
 * Create session and return JWT
 */
export async function createSession(
  clientId: number,
  email: string,
  firstName: string,
  lastName: string,
  role: 'client' | 'admin' | 'owner' = 'client'
): Promise<string> {
  const token = await createJWT({
    sub: String(clientId),
    email,
    firstName,
    lastName,
    role,
  });

  // Store session server-side
  const expiresAt = Date.now() + (JWT_EXPIRY_DAYS * 24 * 60 * 60 * 1000);
  sessions.set(token, { clientId, email, firstName, lastName, role, expiresAt });

  return token;
}

/**
 * Validate session from JWT
 */
export async function validateSession(token: string): Promise<SessionData | null> {
  // First check JWT validity
  const payload = await verifyJWT(token);
  if (!payload) return null;

  // Check session store (optional for stateless, required for revocation)
  const session = sessions.get(token);
  if (session && Date.now() > session.expiresAt) {
    sessions.delete(token);
    return null;
  }

  return {
    clientId: Number(payload.sub),
    email: payload.email,
    firstName: payload.firstName,
    lastName: payload.lastName,
    role: payload.role,
    expiresAt: payload.exp * 1000,
  };
}

/**
 * Destroy session
 */
export function destroySession(token: string): void {
  sessions.delete(token);
}

/**
 * Create httpOnly cookie header value
 */
export function createSessionCookie(token: string, secure: boolean = true): string {
  const maxAge = JWT_EXPIRY_DAYS * 24 * 60 * 60;
  const securePart = secure ? '; Secure' : '';
  return `${COOKIE_NAME}=${token}; HttpOnly; Path=/; SameSite=Lax; Max-Age=${maxAge}${securePart}`;
}

/**
 * Create cookie that clears the session
 */
export function createLogoutCookie(): string {
  return `${COOKIE_NAME}=; HttpOnly; Path=/; SameSite=Lax; Max-Age=0`;
}

/**
 * Parse session token from request
 * Supports both Cookie header and Authorization header
 */
export function getTokenFromRequest(req: Request): string | null {
  // First try Cookie header
  const cookieHeader = req.headers.get('Cookie');
  if (cookieHeader) {
    const cookies = cookieHeader.split(';').map(c => c.trim());
    for (const cookie of cookies) {
      if (cookie.startsWith(`${COOKIE_NAME}=`)) {
        return cookie.substring(COOKIE_NAME.length + 1);
      }
    }
  }

  // Fallback to Authorization header (for API calls)
  const authHeader = req.headers.get('Authorization');
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }

  return null;
}

/**
 * Middleware to validate session and return session data
 */
export async function requireAuth(req: Request): Promise<{ session: SessionData } | { error: Response }> {
  const token = getTokenFromRequest(req);
  
  if (!token) {
    return {
      error: new Response(
        JSON.stringify({ error: 'Unauthorized - no token provided' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      ),
    };
  }

  const session = await validateSession(token);
  
  if (!session) {
    return {
      error: new Response(
        JSON.stringify({ error: 'Session expired or invalid' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      ),
    };
  }

  return { session };
}
