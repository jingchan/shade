import { useEffect, useState } from 'react';
import { User } from 'shade-common';

const API_URL = 'http://localhost:3001/api';

function useAuthApi() {
  const [loggedInUser, setLoggedInUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);

  // Function to check session
  const checkSession = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/auth/session`, {
        method: 'GET',
        credentials: 'include', // Important for cookies to be sent and received
      });
      if (!response.ok) throw new Error('Session check failed');
      const data = await response.json();
      setLoggedInUser(data.user);
    } catch (err) {
      setError(err);
      setLoggedInUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Call checkSession when the component mounts
  useEffect(() => {
    (async () => {
      return await checkSession();
    })();
  }, []);

  const signup = async (username: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });
      if (!response.ok) throw new Error('Failed to signup');
      const user = await response.json();
      setLoggedInUser(user);
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (username_or_email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username_or_email, password }),
      });
      if (!response.ok) throw new Error('Failed to login');
      const res = await response.json();
      if (res.user) {
        setLoggedInUser(res.user);
      } else {
        setError(res.error);
      }
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/auth/logout`);
      if (!response.ok) throw new Error('Failed to logout');
      setLoggedInUser(null);
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    loggedInUser,
    isLoading,
    error,
    signup,
    login,
    logout,
  };
}

export default useAuthApi;
