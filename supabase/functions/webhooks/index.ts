import { getCorsHeaders, handleCors, createCorsResponse, createErrorResponse } from '../_shared/cors.ts';

/**
 * Webhook Handlers for Payment Providers
 * Receives and processes payment confirmations with security validation
 */

const DEV_MODE = Deno.env.get('DEV_MODE') === 'true' || !Deno.env.get('WHMCS_API_URL');
const STRIPE_WEBHOOK_SECRET = Deno.env.get('STRIPE_WEBHOOK_SECRET');

/**
 * Verify Stripe webhook signature
 * Uses timing-safe comparison to prevent timing attacks
 */
async function verifyStripeSignature(
  payload: string, 
  signature: string, 
  secret: string
): Promise<boolean> {
  try {
    const parts = signature.split(',');
    const timestampPart = parts.find(p => p.startsWith('t='));
    const signaturePart = parts.find(p => p.startsWith('v1='));
    
    if (!timestampPart || !signaturePart) {
      console.error('Invalid signature format');
      return false;
    }
    
    const timestamp = timestampPart.split('=')[1];
    const expectedSignature = signaturePart.split('=')[1];
    
    // Check timestamp is within 5 minutes (300 seconds)
    const currentTime = Math.floor(Date.now() / 1000);
    const signatureTime = parseInt(timestamp, 10);
    
    if (Math.abs(currentTime - signatureTime) > 300) {
      console.error('Webhook timestamp too old');
      return false;
    }
    
    // Create the signed payload
    const signedPayload = `${timestamp}.${payload}`;
    
    // Compute HMAC
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );
    
    const signatureBytes = await crypto.subtle.sign(
      'HMAC',
      key,
      encoder.encode(signedPayload)
    );
    
    // Convert to hex
    const computedSignature = Array.from(new Uint8Array(signatureBytes))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
    
    // Timing-safe comparison
    if (computedSignature.length !== expectedSignature.length) {
      return false;
    }
    
    let result = 0;
    for (let i = 0; i < computedSignature.length; i++) {
      result |= computedSignature.charCodeAt(i) ^ expectedSignature.charCodeAt(i);
    }
    
    return result === 0;
  } catch (error) {
    console.error('Signature verification error:', error);
    return false;
  }
}

Deno.serve(async (req) => {
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  const url = new URL(req.url);
  const path = url.pathname.replace('/webhooks', '');

  try {
    // POST /stripe - Stripe webhook
    if (path === '/stripe' && req.method === 'POST') {
      const signature = req.headers.get('stripe-signature');
      const body = await req.text();

      // In production mode, require and verify signature
      if (!DEV_MODE) {
        if (!STRIPE_WEBHOOK_SECRET) {
          console.error('STRIPE_WEBHOOK_SECRET not configured in production');
          return createErrorResponse(req, 'Webhook not configured', 503);
        }

        if (!signature) {
          console.error('Missing Stripe signature header');
          return createErrorResponse(req, 'Missing signature', 401);
        }

        const isValid = await verifyStripeSignature(body, signature, STRIPE_WEBHOOK_SECRET);
        if (!isValid) {
          console.error('Invalid Stripe webhook signature');
          return createErrorResponse(req, 'Invalid signature', 401);
        }
      } else {
        // Dev mode - log but still process
        console.log('[DEV] Stripe webhook received, signature verification skipped');
      }

      // Parse the event
      let event;
      try {
        event = JSON.parse(body);
      } catch {
        return createErrorResponse(req, 'Invalid JSON payload', 400);
      }

      // Validate event structure
      if (!event.type || !event.data || !event.data.object) {
        return createErrorResponse(req, 'Invalid event structure', 400);
      }

      // Handle the event
      switch (event.type) {
        case 'payment_intent.succeeded': {
          const paymentIntent = event.data.object;
          console.log('Payment succeeded:', paymentIntent.id);
          // Mark invoice as paid in WHMCS
          // TODO: Call whmcs-invoices to mark paid
          break;
        }
        case 'payment_intent.payment_failed': {
          console.log('Payment failed:', event.data.object.id);
          break;
        }
        case 'checkout.session.completed': {
          console.log('Checkout completed:', event.data.object.id);
          break;
        }
        default:
          console.log(`Unhandled event type: ${event.type}`);
      }

      return createCorsResponse(req, { received: true });
    }

    // POST /paypal - PayPal webhook
    if (path === '/paypal' && req.method === 'POST') {
      // PayPal webhooks require verification in production
      const paypalTransmissionId = req.headers.get('paypal-transmission-id');
      
      if (!DEV_MODE && !paypalTransmissionId) {
        return createErrorResponse(req, 'Invalid PayPal webhook', 401);
      }

      let body;
      try {
        body = await req.json();
      } catch {
        return createErrorResponse(req, 'Invalid JSON payload', 400);
      }

      if (!body.event_type) {
        return createErrorResponse(req, 'Missing event_type', 400);
      }

      // Handle PayPal events
      switch (body.event_type) {
        case 'CHECKOUT.ORDER.APPROVED':
          console.log('PayPal order approved:', body.resource?.id);
          break;
        case 'PAYMENT.CAPTURE.COMPLETED':
          console.log('PayPal capture completed:', body.resource?.id);
          break;
        default:
          console.log(`Unhandled PayPal event: ${body.event_type}`);
      }

      return createCorsResponse(req, { received: true });
    }

    // POST /crypto - Generic crypto webhook
    if (path === '/crypto' && req.method === 'POST') {
      let body;
      try {
        body = await req.json();
      } catch {
        return createErrorResponse(req, 'Invalid JSON payload', 400);
      }

      console.log('Crypto webhook received:', body.event || 'unknown event');

      return createCorsResponse(req, { received: true });
    }

    // POST /paysafe - Paysafe webhook
    if (path === '/paysafe' && req.method === 'POST') {
      let body;
      try {
        body = await req.json();
      } catch {
        return createErrorResponse(req, 'Invalid JSON payload', 400);
      }

      console.log('Paysafe webhook received');

      return createCorsResponse(req, { received: true });
    }

    return createErrorResponse(req, 'Not found', 404);
  } catch (error: unknown) {
    console.error('Webhook error:', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    return createErrorResponse(req, message, 500);
  }
});
