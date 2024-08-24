import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <div className='app-header'>
      <header>
        <p className='pageHeader'>Payments</p>

        <nav>
          <ul>
            <li>
              <Link to='/paypal'>Paypal</Link>
            </li>
            <li>
              <Link to='/stripe'>Stripe</Link>
            </li>
          </ul>
        </nav>
      </header>
    </div>
  );
};

export default Header;
