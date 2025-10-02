import React from 'react';
import { useAuth } from '../hooks/useAuth';

export const Upload: React.FC = () => {
  const { user } = useAuth();
  return (
    <div className="wrap">
      <h1>Upload your Schedule</h1>
      
    </div>
  );
};