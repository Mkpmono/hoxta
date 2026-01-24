/**
 * Rate Limiting for Edge Functions
 * Protects auth and order endpoints from abuse
 */

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

// In-memory store (use Redis in production for distributed rate limiting)
const rateLimitStore = new Map<string, RateLimitEntry>();

// Default limits
const LIMITS = {
  auth: { requests: 10, windowMs: 60 * 1000 }, // 10 requests per minute for auth
  order: { requests: 20, windowMs: 60 * 1000 }, // 20 requests per minute for orders
  default: { requests: 100, windowMs: 60 * 1000 }, // 100 requests per minute default
} as const;

type LimitType = keyof typeof LIMITS;

/**
 * Get client identifier from request
 */
function getClientId(req: Request): string {
  // Try X-Forwarded-For first (for proxied requests)
  const forwarded = req.headers.get('X-Forwarded-For');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }

  // Try X-Real-IP
  const realIp = req.headers.get('X-Real-IP');
  if (realIp) {
    return realIp;
  }

  // Fallback to a hash of user agent + origin
  const ua = req.headers.get('User-Agent') || 'unknown';
  const origin = req.headers.get('Origin') || 'unknown';
  return `${origin}:${ua}`.substring(0, 100);
}

/**
 * Check if request is rate limited
 */
export function checkRateLimit(req: Request, type: LimitType = 'default'): {
  allowed: boolean;
  remaining: number;
  resetIn: number;
} {
  const clientId = getClientId(req);
  const key = `${type}:${clientId}`;
  const limit = LIMITS[type];
  const now = Date.now();

  // Clean up expired entries periodically
  if (Math.random() < 0.1) {
    for (const [k, v] of rateLimitStore.entries()) {
      if (now > v.resetAt) {
        rateLimitStore.delete(k);
      }
    }
  }

  let entry = rateLimitStore.get(key);

  // Reset if window expired
  if (!entry || now > entry.resetAt) {
    entry = { count: 0, resetAt: now + limit.windowMs };
    rateLimitStore.set(key, entry);
  }

  // Increment count
  entry.count++;

  const allowed = entry.count <= limit.requests;
  const remaining = Math.max(0, limit.requests - entry.count);
  const resetIn = Math.max(0, entry.resetAt - now);

  return { allowed, remaining, resetIn };
}

/**
 * Create rate limit exceeded response
 */
export function createRateLimitResponse(resetIn: number): Response {
  return new Response(
    JSON.stringify({
      error: 'Too many requests',
      retryAfter: Math.ceil(resetIn / 1000),
    }),
    {
      status: 429,
      headers: {
        'Content-Type': 'application/json',
        'Retry-After': String(Math.ceil(resetIn / 1000)),
      },
    }
  );
}

/**
 * Rate limit middleware
 */
export function rateLimit(req: Request, type: LimitType = 'default'): Response | null {
  const { allowed, resetIn } = checkRateLimit(req, type);
  
  if (!allowed) {
    return createRateLimitResponse(resetIn);
  }
  
  return null;
}
