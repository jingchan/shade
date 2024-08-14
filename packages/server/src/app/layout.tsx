import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
// import { cookies } from 'next/headers';
// import { getSessionData } from '@/actions/session';
// import { SessionContext } from './providers/SessionContext';
// import { getSession } from '@/actions/session';
// import { cookies } from 'next/headers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Shadrs.com',
  description: 'All About Shaders',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* <SessionContext.Provider value={sessionData}> */}
        {children}
        {/* </SessionContext.Provider> */}
      </body>
    </html>
  );
}
