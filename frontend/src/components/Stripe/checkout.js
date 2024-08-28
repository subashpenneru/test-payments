import {
  AddressElement,
  LinkAuthenticationElement,
  PaymentElement,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js';
import React, { useState } from 'react';

const Checkout = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);

  const submitPayment = async (e) => {
    e.preventDefault();

    // Code below to add the billing and shipping address info is a temporary fix for an issue with Afterpay
    const { error, ...rest } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: 'http://localhost:3000/',
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
      <LinkAuthenticationElement id='authentication-element' />
      <AddressElement options={{ mode: 'shipping' }} />
      <PaymentElement
        options={{
          layout: {
            type: 'accordion',
            defaultCollapsed: false,
            radios: true,
            spacedAccordionItems: false,
          },
        }}
      />
      <button className='form-control btn btn-primary' onClick={submitPayment}>
        Pay 100 now
      </button>
    </form>
  );
};

export default Checkout;
