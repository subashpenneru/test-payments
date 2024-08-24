import path from 'path';
import fetch from 'node-fetch';
import express from 'express';
import dotenv from 'dotenv';
import Stripe from 'stripe';

dotenv.config();

const {
  PAYPAL_CLIENT_ID,
  PAYPAL_CLIENT_SECRET,
  PAYPAL_MERCHANT_ID,
  STRIPE_SECRET_KEY,
  PORT,
} = process.env;
const base = 'https://api-m.sandbox.paypal.com';
const app = express();

app.use(express.json());

const generateAccessToken = async () => {
  try {
    if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
      throw new Error('MISSING_API_CREDENTIALS');
    }
    const auth = Buffer.from(
      PAYPAL_CLIENT_ID + ':' + PAYPAL_CLIENT_SECRET
    ).toString('base64');
    const response = await fetch(`${base}/v1/oauth2/token`, {
      method: 'POST',
      body: 'grant_type=client_credentials',
      headers: {
        Authorization: `Basic ${auth}`,
      },
    });

    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error('Failed to generate Access Token:', error);
  }
};

const createOrder = async (cart) => {
  // use the cart information passed from the front-end to calculate the purchase unit details
  console.log(
    'shopping cart information passed from the frontend createOrder() callback:',
    cart
  );

  const accessToken = await generateAccessToken();
  const url = `${base}/v2/checkout/orders`;
  const payload = {
    intent: 'CAPTURE',
    purchase_units: [
      {
        amount: {
          currency_code: 'USD',
          value: '100.00',
        },
      },
    ],
  };

  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    method: 'POST',
    body: JSON.stringify(payload),
  });

  return handleResponse(response);
};

const captureOrder = async (orderID) => {
  const accessToken = await generateAccessToken();
  const url = `${base}/v2/checkout/orders/${orderID}/capture`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return handleResponse(response);
};

async function handleResponse(response) {
  try {
    const jsonResponse = await response.json();
    return {
      jsonResponse,
      httpStatusCode: response.status,
    };
  } catch (err) {
    const errorMessage = await response.text();
    throw new Error(errorMessage);
  }
}

app.post('/api/orders', async (req, res) => {
  try {
    // use the cart information passed from the front-end to calculate the order amount details
    const { cart } = req.body;
    const { jsonResponse, httpStatusCode } = await createOrder(cart);
    res.status(httpStatusCode).json(jsonResponse);
  } catch (error) {
    console.error('Failed to create order:', error);
    res.status(500).json({
      error: 'Failed to create order.',
    });
  }
});

app.post('/api/orders/:orderID/capture', async (req, res) => {
  try {
    const { orderID } = req.params;
    const { jsonResponse, httpStatusCode } = await captureOrder(orderID);
    res.status(httpStatusCode).json(jsonResponse);
  } catch (error) {
    console.error('Failed to create order:', error);
    res.status(500).json({
      error: 'Failed to capture order.',
    });
  }
});

app.get('/api/config/paypal', (req, res, next) =>
  res.json({
    clientId: PAYPAL_CLIENT_ID,
    merchantId: PAYPAL_MERCHANT_ID,
    clientSecret: PAYPAL_CLIENT_SECRET,
  })
);

const stripe = new Stripe(STRIPE_SECRET_KEY);

app.post('/api/create-payment-intent', async (req, res) => {
  const { amount, currency = 'usd' } = req.body;

  try {
    const payload = {
      amount: amount,
      currency: currency,
      capture_method: 'automatic',
      customer: 'subash5595',
    };
    if (currency === 'usd') {
      payload.payment_method_types = ['card', 'afterpay_clearpay'];
    }
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: 'usd',
    });

    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} on port ${PORT}`)
);
