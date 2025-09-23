import React from 'react';
import { Link } from 'react-router-dom';

export const Home: React.FC = () => {
  return (
    <div className="wrap">
      <h1 className=''>Welcome</h1>
      <p>Welcome page</p>
      <div className="row">
        <Link to="/login" className="btn">Login</Link>
        <Link to="/register" className="btn outline">Register</Link>
      </div>
    </div>
  );
};