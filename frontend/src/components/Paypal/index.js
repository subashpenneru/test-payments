import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';

import { clientID, merchantID } from '../../constants';
import { createOrder, onApprove } from './utils';

// https://developer.paypal.com/docs/multiparty/checkout/standard/integrate/#set-up-your-environment

const PaypalComponent = () => {
  return (
    <div className='PaypalComponent'>
      <h2>Paypal Payements</h2>
      <div style={{ maxWidth: '375px', marginLeft: '20px', marginTop: '20px' }}>
        <PayPalScriptProvider
          options={{ clientId: clientID, merchantId: merchantID }}>
          <PayPalButtons
            style={{ shape: 'pill' }}
            createOrder={() => createOrder([{ id: 'ORCL_1234', quantity: 2 }])}
            onApprove={onApprove}
          />
        </PayPalScriptProvider>
      </div>
    </div>
  );
};

export default PaypalComponent;
