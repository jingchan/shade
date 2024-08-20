import { SessionContext } from '@/components/providers/SessionContext';
import { createFileRoute } from '@tanstack/react-router';
import { useContext, useEffect } from 'react';

export const Route = createFileRoute('/logout')({
  component: Logout,
});

function Logout() {
  const session = useContext(SessionContext);
  useEffect(() => {
    session?.logout();
  }, [session]);

  if (!session?.user) {
    return <>Not logged in</>;
  }

  // logout().then(() => console.log());
  return <>Logout</>;
}
