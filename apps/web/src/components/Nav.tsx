import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export const Nav: React.FC = () => {
  const { token, user, logout } = useAuth();
  return (
    <nav className="nav">
      <div className="left">
        <Link to="/">CoachMesh</Link>
      </div>
      <div className="right">
        {!token ? (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        ) : (
          <>
            <span className="muted">{user?.email}</span>
            <Link to="/dashboard">Dashboard</Link>
            <button className="link" onClick={logout}>Logout</button>
          </>
        )}
      </div>
    </nav>
  );
};