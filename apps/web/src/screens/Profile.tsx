// THIS IS USED ONLY FOR JWT ROLE TESTING REMOVE OR CHANGE FOR LATER SPRINT
import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { AthleteProfile } from '../features/profiles/athlete/components/AthleteProfile'
import { UserProfile } from '../features/profiles/user/components/UserProfile'
import { ManagerProfile } from '../features/profiles/manager/components/ManagerProfile'

export const Profile: React.FC = () => {
  const { user } = useAuth();
  return (
    <div className="wrap">
      {user?.role == 'user'
      ?<UserProfile></UserProfile>
      : user?.role == 'manager'
      ? <ManagerProfile></ManagerProfile>
      : <div>
          <h1>Profile</h1>
          <pre>{JSON.stringify(user, null, 2)}</pre>
        </div>
      }
    </div>
  );
};