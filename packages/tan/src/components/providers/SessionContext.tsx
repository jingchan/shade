'use client';
import useAuthApi from '@/useAuthApi';
import React, { createContext } from 'react';
import { User } from 'shade-common';

interface SessionContextData {
  user: User | null;
  login: (user: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const SessionContext = createContext<SessionContextData | null>(null);

export default function SessionContextProvider({
  // sessionGetter: () => SessionData | undefined,
  children,
}: {
  children: React.ReactNode;
}) {
  const { sessionUser, login, logout } = useAuthApi();
  const session: SessionContextData = {
    user: sessionUser,
    login,
    logout,
  };

  return (
    <SessionContext.Provider value={session}>
      {children}
    </SessionContext.Provider>
  );
}
