import { useEffect } from 'react';
import { identifyUser } from '../monitoring';

export const useUserIdentification = (userId?: string, userEmail?: string, userName?: string) => {
  useEffect(() => {
    identifyUser(userId, userEmail, userName);
  }, [userId, userEmail, userName]);
};
