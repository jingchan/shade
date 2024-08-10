import { useState } from 'react';

const API_URL = 'http://localhost:3001/api';

function useAuthApi() {
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);

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
      const user = await response.json();
      setLoggedInUser(user);
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
