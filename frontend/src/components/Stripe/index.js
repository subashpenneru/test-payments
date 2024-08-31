import React, { useEffect, useState } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

import Checkout from './checkout';
import { appearance } from './utils';
import CheckoutHosted from './checkout-hosted';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUB_KEY);

const StripeComponent = () => {
  const [clientSecret, setClientSecret] = useState('');
  const [showHosted, setShowHosted] = useState(false);

  useEffect(() => {
    fetch('/api/create-payment-intent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: 10000,
        currency: 'usd',
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setClientSecret(data.clientSecret);
      });
  }, []);

  return (
    <div
      className='stripe-component'
      style={{ maxWidth: '476px', marginLeft: '20px', marginTop: '20px' }}>
      <button
        onClick={() => setShowHosted((prev) => !prev)}
        style={{ marginBottom: '2rem' }}>
        Toggle Checkout Component
      </button>
      {!showHosted && clientSecret && (
        <Elements
          stripe={stripePromise}
          options={{ appearance: appearance, clientSecret: clientSecret }}>
          <Checkout />
        </Elements>
      )}
      {showHosted && <CheckoutHosted />}
    </div>
  );
};

export default StripeComponent;
