import React from 'react';
import { useSearchParams } from 'react-router-dom';

const Confirmation = () => {
  const [params] = useSearchParams();
  //   const sessionId = params.get('session_id');

  return <div>Confirmation</div>;
};

export default Confirmation;
