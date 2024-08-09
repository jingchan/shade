import pool from '@/db/pool';
import { NextResponse } from 'next/server';
import { respondWithError, SignUpError } from '../../errors';
import { generateSessionToken } from '../generateSessionToken';

/**
 * POST /auth/signup
 */
export async function POST(request: Request) {
  const requestJson = await request.json();
  const { username, email, password } = requestJson;

  try {
    await pool.query('BEGIN');
    const userResult = await pool.query(
      `
      INSERT INTO Account (username, email, password_hash)
      VALUES ($1, $2, $3)
      RETURNING id, username, email
      `,
      [username, email, password],
    );
    if (!userResult.rows.length) {
      throw new SignUpError("Couldn't create new account.");
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
      throw new Error('Failed to create session');
    }

    await pool.query('COMMIT');

    return NextResponse.json({
      id: userResult.rows[0].id,
      username: userResult.rows[0].username,
      email: userResult.rows[0].email,
      token: sessionToken,
    });
  } catch (error) {
    await pool.query('ROLLBACK'); // Roll back the transaction on error
    console.log('Signup Error: ', error);
    return respondWithError(error as Error);
  }
}
