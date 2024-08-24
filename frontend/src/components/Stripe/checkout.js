import { useStripe } from '@stripe/react-stripe-js';
import React, { useEffect, useState } from 'react';

import { appearance } from './utils';

const Checkout = () => {
  const stripe = useStripe();
  const [elements, setElements] = useState();
  const [error, setError] = useState(null);
  const [clientSecret, setClientSecret] = useState('');

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

  useEffect(() => {
    if (clientSecret !== '') {
      console.log('useffect', stripe, clientSecret);
      const elements = stripe.elements({
        clientSecret: clientSecret,
        appearance: appearance,
        fonts: [{ cssSrc: 'https://fonts.googleapis.com/css?family=Roboto' }],
      });

      const paymentElement = elements.create('payment');
      paymentElement.mount('#payment-element');
      setElements(elements);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clientSecret]);

  const submitPayment = async (e) => {
    e.preventDefault();

    // Code below to add the billing and shipping address info is a temporary fix for an issue with Afterpay
    const { error, ...rest } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        payment_method_data: {
          billing_details: {
            name: 'Test',
            email: 'test@test.com',
            address: {
              city: 'New York',
              country: 'US',
              line1: '221b Baker street',
              line2: null,
              postal_code: '10001',
              state: 'New York',
            },
          },
        },
        shipping: {
          name: 'Test', //props.custInfo.name,
          address: {
            city: 'New York',
            country: 'US',
            line1: '221b Baker street',
            line2: null,
            postal_code: '10001',
            state: 'New York',
          },
        },
      },
      redirect: 'if_required',
    });

    console.log(error, rest);

    if (error) {
      setError(error.message);
    } else {
      setError('');
    }
  };

  return (
    <form id='payment-form'>
      <div id='payment-element'></div>
      <div>{error}</div>
      <button className='form-control btn btn-primary' onClick={submitPayment}>
        Pay 100 now
      </button>
    </form>
  );
};

export default Checkout;
