import { corsHeaders, handleCors } from '../_shared/cors.ts';

/**
 * Webhook Handlers for Payment Providers
 * Receives and processes payment confirmations
 */

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

      // In production, verify the webhook signature
      const STRIPE_WEBHOOK_SECRET = Deno.env.get('STRIPE_WEBHOOK_SECRET');
      
      if (!STRIPE_WEBHOOK_SECRET) {
        console.log('Stripe webhook received (no secret configured):', body.slice(0, 200));
        return new Response(
          JSON.stringify({ received: true, mockMode: true }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Parse the event
      let event;
      try {
        event = JSON.parse(body);
      } catch (err) {
        return new Response(
          JSON.stringify({ error: 'Invalid JSON' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Handle the event
      switch (event.type) {
        case 'payment_intent.succeeded':
          const paymentIntent = event.data.object;
          console.log('Payment succeeded:', paymentIntent.id);
          // Mark invoice as paid in WHMCS
          // await markInvoicePaid(paymentIntent.metadata.invoice_id, paymentIntent.id, 'stripe');
          break;
        case 'payment_intent.payment_failed':
          console.log('Payment failed:', event.data.object.id);
          break;
        default:
          console.log(`Unhandled event type: ${event.type}`);
      }

      return new Response(
        JSON.stringify({ received: true }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // POST /paypal - PayPal webhook
    if (path === '/paypal' && req.method === 'POST') {
      const body = await req.json();
      console.log('PayPal webhook received:', body.event_type);

      // Handle PayPal events
      switch (body.event_type) {
        case 'CHECKOUT.ORDER.APPROVED':
          console.log('PayPal order approved:', body.resource.id);
          break;
        case 'PAYMENT.CAPTURE.COMPLETED':
          console.log('PayPal capture completed:', body.resource.id);
          // Mark invoice as paid in WHMCS
          break;
        default:
          console.log(`Unhandled PayPal event: ${body.event_type}`);
      }

      return new Response(
        JSON.stringify({ received: true }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // POST /crypto - Generic crypto webhook
    if (path === '/crypto' && req.method === 'POST') {
      const body = await req.json();
      console.log('Crypto webhook received:', body);

      // Handle crypto payment confirmations
      // This would be customized based on the crypto payment provider

      return new Response(
        JSON.stringify({ received: true }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // POST /paysafe - Paysafe webhook
    if (path === '/paysafe' && req.method === 'POST') {
      const body = await req.json();
      console.log('Paysafe webhook received:', body);

      // Handle Paysafe events

      return new Response(
        JSON.stringify({ received: true }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Not found' }),
      { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: unknown) {
    console.error('Webhook error:', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
