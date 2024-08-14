import { getProjectsForUser } from '@/db/project';
import { getIronSession, SessionOptions } from 'iron-session';
import { cookies } from 'next/headers';
import { Project, User } from 'shade-common';

export const SESSION_COOKIE_KEY = 's';
const SESSION_COOKIE_SECRET =
  process.env.SECRET_COOKIE_PASSWORD || 'jnXuW2ANhsNF6pwu8Yr5tJTMVnixVBQr';

export type SessionData = {
  // User, if logged in.
  user: User | null;
};

/**
 * Used in typical server-side API routes.
 *
 * Server-side only.
 */
export async function getSession() {
  const session = await getIronSession<SessionData>(cookies(), {
    cookieName: SESSION_COOKIE_KEY,
    password: SESSION_COOKIE_SECRET, // Must be at least 32 characters long
    cookieOptions: {
      secure: process.env.NODE_ENV === 'production', // HTTPS only in production
    },
  } as SessionOptions);
  return session;
}

/**
 * Used in typical server-side API routes.
 *
 * Server-side only.
 */
export async function logout() {
  const session = await getSession();
  session.user = null;
  await session.save();
  session.destroy();
  return;
}

export async function getSessionProjects(): Promise<Project[]> {
  const session = await getSession();
  if (session.user) {
    return await getProjectsForUser(session.user.id);
  }
  return [];
}
