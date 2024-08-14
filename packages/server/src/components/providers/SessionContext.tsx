'use client';
import { SessionData } from '@/actions/session';
import React, { createContext } from 'react';

export const SessionContext = createContext<SessionData | undefined>(undefined);

export default function SessionProvider({
  // sessionGetter: () => SessionData | undefined,
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionContext.Provider value={session}>
      {children}
    </SessionContext.Provider>
  );
}
