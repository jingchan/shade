import pool from '@/db/pool';
import { respondWithError, LoginError } from '../../errors';
import { generateSessionToken } from '../generateSessionToken';
import { getSession, logout } from '@/actions/session';

const InvalidCredentialsResponse = {
  error: 'Invalid username or password.',
};

/**
 * POST /auth/login
 */
export async function POST(request: Request) {
  logout();
  const requestJson = await request.json();
  const { username, password } = requestJson;

  if (!username) {
    return respondWithError(new Error('Missing username or email'));
  }
  if (!password) {
    return respondWithError(new LoginError('Missing password'));
  }

  try {
    await pool.query('BEGIN');
    const userResult = await pool.query(
      `
      SELECT id, username, email FROM Account
      WHERE (username=$1 OR email=$1) AND password_hash=$2
      `,
      [username, password],
    );
    if (!userResult.rows.length) {
      return Response.json(InvalidCredentialsResponse, { status: 200 });
    }

    const user = userResult.rows[0];
    const sessionToken = generateSessionToken();
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30); // 30 days

    const sessionResult = await pool.query(
      `
      INSERT INTO Sessions (user_id, token, expires_at)
      VALUES ($1, $2, $3)
      RETURNING id;
      `,
      [user.id, sessionToken, expiresAt],
    );
    if (!sessionResult.rows.length) {
      throw new LoginError('Failed to create session');
    }
    await pool.query('COMMIT');

    const session = await getSession();
    session.user = user;
    await session.save();

    return Response.json(
      {
        user,
      },
      // {
      //   headers: [
      //     [
      //       'Set-Cookie',
      //       `${SESSION_COOKIE_KEY}=${sessionToken}; HttpOnly; Path=/; SameSite=Strict`,
      //     ],
      //   ],
      // },
    );
  } catch (error) {
    await pool.query('ROLLBACK'); // Roll back the transaction on error
    console.log('Login error: ', error);
    return respondWithError(error as Error);
  }
}
