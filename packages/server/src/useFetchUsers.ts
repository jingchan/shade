import { useEffect, useState } from 'react';

const API_URL = 'http://localhost:3001/api';

export default function useFetchUsers() {
  const [loggedInUser, setData] = useState<number | null>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<unknown | null>();

  // NOTE: Not implemented.
  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const response = await fetch(`${API_URL}/users`);
        const { results: users } = await response.json();
        setData(users);
        setError(null);
      } catch (err: unknown) {
        setData(null);
        setError(err);
      }
      setIsLoading(false);
    }
    fetchData();
  }, []);

  return { loggedInUser, isLoading, error };
}
