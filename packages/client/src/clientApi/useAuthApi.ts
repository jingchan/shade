import { User } from 'shade-common';
import { Ref, ref } from 'vue';

const API_URL = 'http://localhost:3001/api';

export function useAuthApi() {
  const loggedInUser: Ref<User | null> = ref(null);
  const isLoading: Ref<boolean> = ref(false);
  const error: Ref<Error | null> = ref(null);

  const signup = async (
    username: string,
    email: string,
    password: string,
  ): Promise<void> => {
    isLoading.value = true;
    try {
      const response = await fetch(`${API_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });
      if (!response.ok) throw new Error('Failed to signup');
      const responseJson = await response.json();
      console.log(responseJson);
      // loggedInUser.value = await response.json();
      loggedInUser.value = responseJson;
    } catch (err) {
      if (err instanceof Error) {
        error.value = err;
      }
    } finally {
      isLoading.value = false;
    }
  };

  const login = async (email: string, password: string): Promise<void> => {
    isLoading.value = true;
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!response.ok) throw new Error('Failed to login');
      loggedInUser.value = await response.json();
    } catch (err) {
      if (err instanceof Error) {
        error.value = err;
      }
    } finally {
      isLoading.value = false;
    }
  };

  const logout = async (): Promise<void> => {
    isLoading.value = true;
    try {
      const response = await fetch(`${API_URL}/auth/logout`);
      if (!response.ok) throw new Error('Failed to logout');
      loggedInUser.value = null;
    } catch (err) {
      if (err instanceof Error) {
        error.value = err;
      }
    } finally {
      isLoading.value = false;
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
