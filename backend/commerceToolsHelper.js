import { createClient } from '@commercetools/sdk-client';
import { createAuthMiddlewareForClientCredentialsFlow } from '@commercetools/sdk-middleware-auth';
import { createHttpMiddleware } from '@commercetools/sdk-middleware-http';
import { createApiBuilderFromCtpClient } from '@commercetools/platform-sdk';

// Add commercetools client configuration
const projectKey = process.env.CTP_PROJECT_KEY;
const clientId = process.env.CTP_CLIENT_ID;
const clientSecret = process.env.CTP_CLIENT_SECRET;
const apiUrl = process.env.CTP_API_URL;
const authUrl = process.env.CTP_AUTH_URL;

const ctpClient = createClient({
  middlewares: [
    createAuthMiddlewareForClientCredentialsFlow({
      host: authUrl,
      projectKey: projectKey,
      credentials: {
        clientId: clientId,
        clientSecret: clientSecret,
      },
    }),
    createHttpMiddleware({ host: apiUrl }),
  ],
});

const apiRoot = createApiBuilderFromCtpClient(ctpClient);

// Add a new route for creating a payment in commercetools
app.post('/api/commercetools/create-payment', async (req, res) => {
  try {
    const { amount, currency, paymentMethodInfo } = req.body;

    const paymentDraft = {
      amountPlanned: {
        centAmount: amount * 100, // Convert to cents
        currencyCode: currency,
      },
      paymentMethodInfo: paymentMethodInfo,
    };

    const payment = await apiRoot
      .payments()
      .post({
        body: paymentDraft,
      })
      .execute();

    res.status(201).json(payment.body);
  } catch (error) {
    console.error('Failed to create payment in commercetools:', error);
    res.status(500).json({
      error: 'Failed to create payment in commercetools.',
    });
  }
});

// ... existing imports and configuration ...

// Add a new route for creating an order with payment in commercetools
app.post('/api/commercetools/create-order-with-payment', async (req, res) => {
  try {
    const { amount, currency, paymentMethodInfo, cartId, version } = req.body;

    // Step 1: Create a payment
    const paymentDraft = {
      amountPlanned: {
        centAmount: amount * 100, // Convert to cents
        currencyCode: currency,
      },
      paymentMethodInfo: paymentMethodInfo,
    };

    const paymentResponse = await apiRoot
      .payments()
      .post({
        body: paymentDraft,
      })
      .execute();

    const paymentId = paymentResponse.body.id;

    // Step 2: Create an order from the cart, including the payment
    const orderFromCartDraft = {
      id: cartId,
      version: version,
      paymentState: 'Pending',
      orderState: 'Open',
      paymentInfo: {
        payments: [
          {
            typeId: 'payment',
            id: paymentId,
          },
        ],
      },
    };

    const orderResponse = await apiRoot
      .orders()
      .post({
        body: orderFromCartDraft,
      })
      .execute();

    res.status(201).json({
      order: orderResponse.body,
      payment: paymentResponse.body,
    });
  } catch (error) {
    console.error(
      'Failed to create order with payment in commercetools:',
      error
    );
    res.status(500).json({
      error: 'Failed to create order with payment in commercetools.',
      details: error.message,
    });
  }
});

// ... existing imports and configuration ...

// Add a new route for updating an order with payment success in commercetools
app.post(
  '/api/commercetools/update-order-payment-success',
  async (req, res) => {
    try {
      const { orderId, orderVersion, paymentId, paymentVersion } = req.body;

      // Step 1: Update the payment state to 'Paid'
      const paymentUpdateActions = [
        {
          action: 'changeTransactionState',
          state: 'Success',
          transactionId: paymentId,
        },
      ];

      const paymentResponse = await apiRoot
        .payments()
        .withId({ ID: paymentId })
        .post({
          body: {
            version: paymentVersion,
            actions: paymentUpdateActions,
          },
        })
        .execute();

      // Step 2: Update the order state to 'Complete'
      const orderUpdateActions = [
        {
          action: 'changeOrderState',
          orderState: 'Complete',
        },
        {
          action: 'changePaymentState',
          paymentState: 'Paid',
        },
      ];

      const orderResponse = await apiRoot
        .orders()
        .withId({ ID: orderId })
        .post({
          body: {
            version: orderVersion,
            actions: orderUpdateActions,
          },
        })
        .execute();

      res.status(200).json({
        order: orderResponse.body,
        payment: paymentResponse.body,
      });
    } catch (error) {
      console.error(
        'Failed to update order with payment success in commercetools:',
        error
      );
      res.status(500).json({
        error: 'Failed to update order with payment success in commercetools.',
        details: error.message,
      });
    }
  }
);
