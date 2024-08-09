import pool from '@/db/pool';
import { NextResponse } from 'next/server';
import { respondWithError, LoginError } from '../../errors';
import { generateSessionToken } from '../generateSessionToken';

const SESSION_COOKIE_KEY = 's';

/**
 * POST /auth/login
 */
export async function POST(request: Request) {
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
      SELECT * FROM Account
      WHERE (username=$1 OR email=$1) AND password_hash=$2
      RETURNING id, username, email
      `,
      [username, password],
    );
    if (!userResult.rows.length) {
      throw new LoginError('Invalid user/password.');
    }

    const sessionToken = generateSessionToken();
    const sessionResult = await pool.query(
      `
      INSERT INTO Sessions (user_id, token)
      VALUES ($1, $2)
      RETURNING id;
      `,
      [userResult.rows[0].id, sessionToken],
    );
    if (!sessionResult.rows.length) {
      throw new LoginError('Failed to create session');
    }

    await pool.query('COMMIT');

    // res.writeHead(200, {
    //   'Content-Type': 'text/plain',
    //   'Set-Cookie': `sessionId=${sessionId}; HttpOnly; Path=/; SameSite=Strict`,
    // });

    // const sessionvalue =
    const response = NextResponse.next();
    response.headers.set(
      'Set-Cookie',
      `${SESSION_COOKIE_KEY}=${sessionToken}; HttpOnly; Path=/; SameSite=Strict`,
    );
    response.json();
    return NextResponse.json({
      id: userResult.rows[0].id,
      username: userResult.rows[0].username,
      email: userResult.rows[0].email,
    });
  } catch (error) {
    await pool.query('ROLLBACK'); // Roll back the transaction on error
    console.log('Login error: ', error);
    return respondWithError(error as Error);
  }
}
