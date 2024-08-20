import { createRootRoute, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';

import NavBar from '../components/NavBar';
import SessionContextProvider from '@/components/providers/SessionContext';

export const Route = createRootRoute({
  component: App,
});

export default function App() {
  return (
    <main className="flex flex-col items-center h-full min-h-full">
      <SessionContextProvider>
        <NavBar />
        <Outlet />
      </SessionContextProvider>
      <TanStackRouterDevtools />
    </main>
  );
}
