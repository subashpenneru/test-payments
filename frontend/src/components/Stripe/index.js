import React from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

import Checkout from './checkout';

const stripePromise = loadStripe(process.env.REACT_APP_PAYPAL_STRIPE_PUB_KEY);

const StripeComponent = () => {
  return (
    <div
      className='stripe-component'
      style={{ maxWidth: '476px', marginLeft: '20px', marginTop: '20px' }}>
      <Elements stripe={stripePromise}>
        <Checkout />
      </Elements>
    </div>
  );
};

export default StripeComponent;
