import { useRef, useState } from 'react';
import { User } from 'shade-common';

const API_URL = 'http://localhost:3001/api';
const AUTH_USER_KEY = 'u';

function useAuthApi() {
  const [sessionUser, setSessionUser] = useState<User | null>(
    loadSessionUser(),
  );
  // loadSessionUser(),
  // const [isLoading, setIsLoading] = useState(false);
  // const [error, setError] = useState<unknown>(null);
  const isLoading = useRef<boolean>(false);
  const error = useRef<unknown>(null);

  function saveSessionUser(user: User | null) {
    console.log('savesession', user);
    if (user) {
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(AUTH_USER_KEY);
    }
    console.log('saved', localStorage.getItem(AUTH_USER_KEY));
  }

  function loadSessionUser(): User | null {
    const userString = localStorage.getItem(AUTH_USER_KEY);
    console.log('loadsession', userString);
    if (userString) {
      try {
        // setSessionUser(JSON.parse(userString) as User);
        return JSON.parse(userString) as User;
      } catch (e: unknown) {
        console.log('Parse error:', e);
        return null;
      }
    }
    return null;
  }

  // Function to check session
  // const validateSession = async () => {
  //   isLoading.current = true;
  //   try {
  //     const response = await fetch(`${API_URL}/auth/session`, {
  //       method: 'GET',
  //       credentials: 'include', // Important for cookies to be sent and received
  //     });
  //     if (!response.ok) throw new Error('Session check failed');
  //     const data = await response.json();
  //     setSessionUser(data.user);
  //   } catch (err) {
  //     error.current = err;
  //     setSessionUser(null);
  //   } finally {
  //     isLoading.current = false;
  //   }
  // };

  const signup = async (username: string, email: string, password: string) => {
    isLoading.current = true;
    try {
      const response = await fetch(`${API_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });
      if (!response.ok) throw new Error('Failed to signup');
      const user = await response.json();
      setSessionUser(user);
      saveSessionUser(user);
    } catch (err) {
      error.current = err;
    } finally {
      isLoading.current = false;
    }
  };

  async function login(username_or_email: string, password: string) {
    isLoading.current = true;
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username_or_email, password }),
      });
      if (!response.ok) throw new Error('Failed to login');
      const res = await response.json();
      if (res.user) {
        console.log(res.user);
        setSessionUser(res.user);
        saveSessionUser(res.user);
      } else {
        error.current = res.error;
      }
    } catch (err) {
      error.current = err;
    } finally {
      isLoading.current = false;
    }
  }

  const logout = async () => {
    isLoading.current = true;
    const response = await fetch(`${API_URL}/auth/logout`, {
      method: 'POST',
    });
    try {
      // const response = await fetch(`${API_URL}/auth/logout`);
      if (!response.ok) throw new Error('Failed to logout');
      setSessionUser(null);
      saveSessionUser(null);
      // } catch (err) {
      //   console.log('errorcaught', err);
      //   error.current = err;
    } finally {
      isLoading.current = false;
    }
  };

  return {
    sessionUser,
    isLoading,
    error,
    signup,
    login,
    logout,
  };
}

export default useAuthApi;
