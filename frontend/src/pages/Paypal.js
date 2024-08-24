import PaypalComponent from '../components/Paypal';

// https://developer.paypal.com/docs/multiparty/checkout/standard/integrate/#set-up-your-environment

const PaypalPage = () => {
  return (
    <div className='paypal-page'>
      <h1>Paypal Payements</h1>
      <PaypalComponent />
    </div>
  );
};

export default PaypalPage;
