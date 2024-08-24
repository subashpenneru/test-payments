export const createOrder = async (cart = []) => {
  try {
    const response = await fetch('/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      // use the "body" param to optionally pass additional order information
      // like product ids and quantities
      body: JSON.stringify({
        cart: cart,
      }),
    });

    const orderData = await response.json();
    console.log('orderData', orderData);

    if (orderData.id) {
      return orderData.id;
    } else {
      const errorDetail = orderData?.details?.[0];
      const errorMessage = errorDetail
        ? `${errorDetail.issue} ${errorDetail.description} (${orderData.debug_id})`
        : JSON.stringify(orderData);

      throw new Error(errorMessage);
    }
  } catch (error) {
    console.error(error);
  }
};

export const onApprove = async (data, actions) => {
  console.log('onApprove', data, actions);
  try {
    const response = await fetch(`/api/orders/${data.orderID}/capture`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const orderData = await response.json();
    console.log('orderData', orderData);

    const errorDetail = orderData?.details?.[0];

    if (errorDetail?.issue === 'INSTRUMENT_DECLINED') {
      return actions.restart();
    } else if (errorDetail) {
      throw new Error(`${errorDetail.description} (${orderData.debug_id})`);
    } else if (!orderData.purchase_units) {
      throw new Error(JSON.stringify(orderData));
    } else {
      const transaction =
        orderData?.purchase_units?.[0]?.payments?.captures?.[0] ||
        orderData?.purchase_units?.[0]?.payments?.authorizations?.[0];
      console.log('Capture result', transaction);
    }
  } catch (error) {
    console.error(error);
  }
};
