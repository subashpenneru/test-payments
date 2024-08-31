import React from 'react';

const CheckoutHosted = () => {
  const onClickHandler = async () => {
    fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        payment_method_types: ['card', 'amazon_pay'],
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: 'Apple Iphone XYZ',
              },
              unit_amount: 2400,
            },
            quantity: 2,
          },
        ],
        mode: 'payment',
        success_url: `http://localhost:3000/confirmation?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: 'http://localhost:3000/',
      }),
    })
      .then((res) => res.json())
      .then(({ data }) => {
        console.log(data);
        if (data?.url) {
          window.open(data.url, '_blank');
        }
      });
  };

  return (
    <>
      <p>Checkout Hosted</p>

      <button onClick={onClickHandler}>Go to Stripe Checkout</button>
    </>
  );
};

export default CheckoutHosted;
