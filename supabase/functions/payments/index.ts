import { getCorsHeaders, handleCors, createCorsResponse, createErrorResponse } from '../_shared/cors.ts';
import { validateAmount, validateCurrency, validateText } from '../_shared/validation.ts';

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
      let body;
      try {
        body = await req.json();
      } catch {
        return createErrorResponse(req, 'Invalid JSON body', 400);
      }

      const { amount, currency, invoiceId, customerEmail } = body;

      // Validate amount
      const amountValidation = validateAmount(amount);
      if (!amountValidation.valid) {
        return createErrorResponse(req, amountValidation.error!, 400);
      }

      // Validate currency
      const currencyValidation = validateCurrency(currency);
      if (!currencyValidation.valid) {
        return createErrorResponse(req, currencyValidation.error!, 400);
      }

      // Validate optional invoice ID
      if (invoiceId) {
        const invoiceValidation = validateText(invoiceId, 'Invoice ID', { maxLength: 100 });
        if (!invoiceValidation.valid) {
          return createErrorResponse(req, invoiceValidation.error!, 400);
        }
      }

      // Validate optional customer email
      if (customerEmail) {
        const emailValidation = validateText(customerEmail, 'Customer email', { maxLength: 255 });
        if (!emailValidation.valid) {
          return createErrorResponse(req, emailValidation.error!, 400);
        }
      }

      if (MOCK_MODE) {
        // Return mock PaymentIntent
        return createCorsResponse(req, {
          clientSecret: `pi_mock_${Date.now()}_secret_mock`,
          paymentIntentId: `pi_mock_${Date.now()}`,
          mockMode: true,
        });
      }

      // Real Stripe PaymentIntent creation
      const stripeResponse = await fetch('https://api.stripe.com/v1/payment_intents', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${STRIPE_SECRET}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          amount: String(Math.round((amountValidation.sanitized as number) * 100)), // Stripe uses cents
          currency: (currencyValidation.sanitized as string).toLowerCase(),
          'metadata[invoice_id]': invoiceId || '',
          'receipt_email': customerEmail || '',
        }).toString(),
      });

      const stripeData = await stripeResponse.json();

      if (stripeData.error) {
        return createErrorResponse(req, stripeData.error.message, 400);
      }

      return createCorsResponse(req, {
        clientSecret: stripeData.client_secret,
        paymentIntentId: stripeData.id,
      });
    }

    // POST /stripe/confirm - Confirm payment and update WHMCS
    if (path === '/stripe/confirm' && req.method === 'POST') {
      let body;
      try {
        body = await req.json();
      } catch {
        return createErrorResponse(req, 'Invalid JSON body', 400);
      }

      const { paymentIntentId, invoiceId } = body;

      // Validate payment intent ID
      const piValidation = validateText(paymentIntentId, 'Payment Intent ID', { required: true, maxLength: 100 });
      if (!piValidation.valid) {
        return createErrorResponse(req, piValidation.error!, 400);
      }

      if (MOCK_MODE) {
        return createCorsResponse(req, {
          success: true,
          status: 'succeeded',
          transactionId: paymentIntentId || `txn_mock_${Date.now()}`,
          mockMode: true,
        });
      }

      // Verify payment with Stripe
      const stripeResponse = await fetch(`https://api.stripe.com/v1/payment_intents/${piValidation.sanitized}`, {
        headers: {
          'Authorization': `Bearer ${STRIPE_SECRET}`,
        },
      });

      const paymentIntent = await stripeResponse.json();

      if (paymentIntent.status === 'succeeded') {
        // Mark invoice as paid in WHMCS
        return createCorsResponse(req, {
          success: true,
          status: 'succeeded',
          transactionId: paymentIntentId,
        });
      }

      return createErrorResponse(req, 'Payment not completed', 400);
    }

    // POST /paypal/create-order - Create PayPal order
    if (path === '/paypal/create-order' && req.method === 'POST') {
      let body;
      try {
        body = await req.json();
      } catch {
        return createErrorResponse(req, 'Invalid JSON body', 400);
      }

      const { amount, currency, invoiceId } = body;

      // Validate amount
      const amountValidation = validateAmount(amount);
      if (!amountValidation.valid) {
        return createErrorResponse(req, amountValidation.error!, 400);
      }

      // Validate currency
      const currencyValidation = validateCurrency(currency);
      if (!currencyValidation.valid) {
        return createErrorResponse(req, currencyValidation.error!, 400);
      }

      if (MOCK_MODE) {
        return createCorsResponse(req, {
          orderId: `PAYPAL-${Date.now()}`,
          approveUrl: `https://sandbox.paypal.com/checkoutnow?token=MOCK-${Date.now()}`,
          mockMode: true,
        });
      }

      // Real PayPal order creation would go here
      return createErrorResponse(req, 'PayPal not configured', 501);
    }

    // POST /paypal/capture - Capture PayPal order
    if (path === '/paypal/capture' && req.method === 'POST') {
      let body;
      try {
        body = await req.json();
      } catch {
        return createErrorResponse(req, 'Invalid JSON body', 400);
      }

      const { orderId, invoiceId } = body;

      // Validate order ID
      const orderValidation = validateText(orderId, 'Order ID', { required: true, maxLength: 100 });
      if (!orderValidation.valid) {
        return createErrorResponse(req, orderValidation.error!, 400);
      }

      if (MOCK_MODE) {
        return createCorsResponse(req, {
          success: true,
          transactionId: `PAYPAL-TXN-${Date.now()}`,
          mockMode: true,
        });
      }

      // Real PayPal capture would go here
      return createErrorResponse(req, 'PayPal not configured', 501);
    }

    // POST /crypto/create-invoice - Create crypto invoice
    if (path === '/crypto/create-invoice' && req.method === 'POST') {
      let body;
      try {
        body = await req.json();
      } catch {
        return createErrorResponse(req, 'Invalid JSON body', 400);
      }

      const { amount, currency, invoiceId } = body;

      // Validate amount
      const amountValidation = validateAmount(amount);
      if (!amountValidation.valid) {
        return createErrorResponse(req, amountValidation.error!, 400);
      }

      if (MOCK_MODE) {
        return createCorsResponse(req, {
          cryptoInvoiceId: `CRYPTO-${Date.now()}`,
          paymentAddress: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
          amount: amountValidation.sanitized,
          currency: 'BTC',
          expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
          qrCode: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=bitcoin:1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa?amount=${amountValidation.sanitized}`,
          mockMode: true,
        });
      }

      // Real crypto invoice creation would go here
      return createErrorResponse(req, 'Crypto payments not configured', 501);
    }

    // POST /paysafe/create-session - Create Paysafe session
    if (path === '/paysafe/create-session' && req.method === 'POST') {
      let body;
      try {
        body = await req.json();
      } catch {
        return createErrorResponse(req, 'Invalid JSON body', 400);
      }

      const { amount, currency, invoiceId } = body;

      // Validate amount
      const amountValidation = validateAmount(amount);
      if (!amountValidation.valid) {
        return createErrorResponse(req, amountValidation.error!, 400);
      }

      if (MOCK_MODE) {
        return createCorsResponse(req, {
          sessionId: `PAYSAFE-${Date.now()}`,
          redirectUrl: `/checkout/pay?paysafe=mock&invoice=${invoiceId || 'unknown'}`,
          mockMode: true,
        });
      }

      // Real Paysafe session creation would go here
      return createErrorResponse(req, 'Paysafe not configured', 501);
    }

    // GET /status/:transactionId - Check payment status
    const statusMatch = path.match(/^\/status\/(.+)$/);
    if (statusMatch && req.method === 'GET') {
      const transactionId = statusMatch[1];

      // Validate transaction ID
      const txnValidation = validateText(transactionId, 'Transaction ID', { required: true, maxLength: 100 });
      if (!txnValidation.valid) {
        return createErrorResponse(req, txnValidation.error!, 400);
      }

      if (MOCK_MODE) {
        return createCorsResponse(req, {
          transactionId: txnValidation.sanitized,
          status: 'completed',
          mockMode: true,
        });
      }

      // Real payment status check would go here
      return createCorsResponse(req, { transactionId: txnValidation.sanitized, status: 'unknown' });
    }

    return createErrorResponse(req, 'Not found', 404);
  } catch (error: unknown) {
    console.error('Payments error:', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    return createErrorResponse(req, message, 500);
  }
});
