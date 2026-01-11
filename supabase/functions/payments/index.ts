import { corsHeaders, handleCors } from '../_shared/cors.ts';

/**
 * Payment Processing Edge Function
 * Handles Stripe, PayPal, Crypto, and Paysafe payment methods
 */

const MOCK_MODE = !Deno.env.get('STRIPE_SECRET_KEY');
const STRIPE_SECRET = Deno.env.get('STRIPE_SECRET_KEY');

Deno.serve(async (req) => {
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  const url = new URL(req.url);
  const path = url.pathname.replace('/payments', '');

  try {
    // POST /stripe/create-intent - Create Stripe PaymentIntent
    if (path === '/stripe/create-intent' && req.method === 'POST') {
      const { amount, currency, invoiceId, customerEmail } = await req.json();

      if (!amount || !currency) {
        return new Response(
          JSON.stringify({ error: 'Amount and currency required' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      if (MOCK_MODE) {
        // Return mock PaymentIntent
        return new Response(
          JSON.stringify({
            clientSecret: `pi_mock_${Date.now()}_secret_mock`,
            paymentIntentId: `pi_mock_${Date.now()}`,
            mockMode: true,
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Real Stripe PaymentIntent creation
      const stripeResponse = await fetch('https://api.stripe.com/v1/payment_intents', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${STRIPE_SECRET}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          amount: String(Math.round(amount * 100)), // Stripe uses cents
          currency: currency.toLowerCase(),
          'metadata[invoice_id]': invoiceId || '',
          'receipt_email': customerEmail || '',
        }).toString(),
      });

      const stripeData = await stripeResponse.json();

      if (stripeData.error) {
        return new Response(
          JSON.stringify({ error: stripeData.error.message }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({
          clientSecret: stripeData.client_secret,
          paymentIntentId: stripeData.id,
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // POST /stripe/confirm - Confirm payment and update WHMCS
    if (path === '/stripe/confirm' && req.method === 'POST') {
      const { paymentIntentId, invoiceId } = await req.json();

      if (MOCK_MODE) {
        return new Response(
          JSON.stringify({
            success: true,
            status: 'succeeded',
            transactionId: paymentIntentId || `txn_mock_${Date.now()}`,
            mockMode: true,
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Verify payment with Stripe
      const stripeResponse = await fetch(`https://api.stripe.com/v1/payment_intents/${paymentIntentId}`, {
        headers: {
          'Authorization': `Bearer ${STRIPE_SECRET}`,
        },
      });

      const paymentIntent = await stripeResponse.json();

      if (paymentIntent.status === 'succeeded') {
        // Mark invoice as paid in WHMCS
        // This would call the whmcs-invoices endpoint
        return new Response(
          JSON.stringify({
            success: true,
            status: 'succeeded',
            transactionId: paymentIntentId,
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({
          success: false,
          status: paymentIntent.status,
          error: 'Payment not completed',
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // POST /paypal/create-order - Create PayPal order
    if (path === '/paypal/create-order' && req.method === 'POST') {
      const { amount, currency, invoiceId } = await req.json();

      if (MOCK_MODE) {
        return new Response(
          JSON.stringify({
            orderId: `PAYPAL-${Date.now()}`,
            approveUrl: `https://sandbox.paypal.com/checkoutnow?token=MOCK-${Date.now()}`,
            mockMode: true,
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Real PayPal order creation would go here
      return new Response(
        JSON.stringify({ error: 'PayPal not configured' }),
        { status: 501, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // POST /paypal/capture - Capture PayPal order
    if (path === '/paypal/capture' && req.method === 'POST') {
      const { orderId, invoiceId } = await req.json();

      if (MOCK_MODE) {
        return new Response(
          JSON.stringify({
            success: true,
            transactionId: `PAYPAL-TXN-${Date.now()}`,
            mockMode: true,
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Real PayPal capture would go here
      return new Response(
        JSON.stringify({ error: 'PayPal not configured' }),
        { status: 501, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // POST /crypto/create-invoice - Create crypto invoice
    if (path === '/crypto/create-invoice' && req.method === 'POST') {
      const { amount, currency, invoiceId } = await req.json();

      if (MOCK_MODE) {
        return new Response(
          JSON.stringify({
            cryptoInvoiceId: `CRYPTO-${Date.now()}`,
            paymentAddress: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
            amount: amount,
            currency: 'BTC',
            expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
            qrCode: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=bitcoin:1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa?amount=${amount}`,
            mockMode: true,
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Real crypto invoice creation would go here (BTCPay, Coinbase Commerce, etc.)
      return new Response(
        JSON.stringify({ error: 'Crypto payments not configured' }),
        { status: 501, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // POST /paysafe/create-session - Create Paysafe session
    if (path === '/paysafe/create-session' && req.method === 'POST') {
      const { amount, currency, invoiceId } = await req.json();

      if (MOCK_MODE) {
        return new Response(
          JSON.stringify({
            sessionId: `PAYSAFE-${Date.now()}`,
            redirectUrl: `/checkout/pay?paysafe=mock&invoice=${invoiceId}`,
            mockMode: true,
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Real Paysafe session creation would go here
      return new Response(
        JSON.stringify({ error: 'Paysafe not configured' }),
        { status: 501, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // GET /status/:transactionId - Check payment status
    const statusMatch = path.match(/^\/status\/(.+)$/);
    if (statusMatch && req.method === 'GET') {
      const transactionId = statusMatch[1];

      if (MOCK_MODE) {
        return new Response(
          JSON.stringify({
            transactionId,
            status: 'completed',
            mockMode: true,
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Real payment status check would go here
      return new Response(
        JSON.stringify({ transactionId, status: 'unknown' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Not found' }),
      { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: unknown) {
    console.error('Payments error:', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
