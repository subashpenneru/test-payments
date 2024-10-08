import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Explore from './pages/Explore';
import PaypalPage from './pages/Paypal';
import StripePage from './pages/Stripe';
import Confirmation from './pages/Confirmation';
import Header from './components/Header';

function App() {
  return (
    <div className='App'>
      <Router>
        <Header />
        <Routes>
          <Route path='/' element={<Explore />} />
          <Route path='/paypal' element={<PaypalPage />} />
          <Route path='/stripe' element={<StripePage />} />
          <Route path='/confirmation' element={<Confirmation />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
