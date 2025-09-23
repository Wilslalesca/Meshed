// THIS IS USED ONLY FOR JWT ROLE TESTING REMOVE OR CHANGE FOR LATER SPRINT
import React from 'react';
import { useAuth } from '../hooks/useAuth';

export const Profile: React.FC = () => {
  const { user } = useAuth();
  return (
    <div className="wrap">
      <h1>Profile</h1>
      <pre>{JSON.stringify(user, null, 2)}</pre>
    </div>
  );
};