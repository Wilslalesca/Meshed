import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { Link } from 'react-router-dom';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  return (
    <div className="wrap">
      <h1>Dashboard</h1>
      <p>Hello, <strong>{user?.name}</strong> ({user?.role})</p>
      <div className="row">
        <Link to="/admin" className="btn">Admin Panel</Link>
        <Link to="/manager" className="btn">Manager Panel</Link>
        <Link to="/profile" className="btn outline">Profile</Link>
      </div>
    </div>
  );
};