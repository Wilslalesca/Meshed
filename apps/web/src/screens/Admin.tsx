import React from 'react';

export const Admin: React.FC = () => {
  return (
    <div className="wrap">
      <h1>Admin Panel</h1>
      <p>Only <code>admin</code> role can access this route.</p>
    </div>
  );
};