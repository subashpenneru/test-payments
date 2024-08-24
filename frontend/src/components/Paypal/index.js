import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';

import { clientID, merchantID } from '../../constants';
import { createOrder, onApprove } from './utils';

const PaypalComponent = () => {
  return (
    <div
      className='paypal-component'
      style={{ maxWidth: '375px', marginLeft: '20px', marginTop: '20px' }}>
      <PayPalScriptProvider
        options={{ clientId: clientID, merchantId: merchantID }}>
        <PayPalButtons
          style={{ shape: 'pill' }}
          createOrder={() => createOrder([{ id: 'ORCL_1234', quantity: 2 }])}
          onApprove={onApprove}
        />
      </PayPalScriptProvider>
    </div>
  );
};

export default PaypalComponent;
