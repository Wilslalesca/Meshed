// THIS IS USED ONLY FOR JWT ROLE TESTING REMOVE OR CHANGE FOR LATER SPRINT
import React from 'react';

export const Manager: React.FC = () => {
  return (
    <div className="wrap">
      <h1>Manager Panel</h1>
      <p>Accessible by <code>manager</code> and <code>admin</code>.</p>
    </div>
  );
};