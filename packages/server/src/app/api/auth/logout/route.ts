import pool from '@/db/pool';
import { NextResponse } from 'next/server';
import { respondWithError, LoginError } from '../../errors';

/**
 * POST /auth/logout
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
    const { rows } = await pool.query(
      `
      SELECT * FROM Account
      WHERE (username=$1 OR email=$1) AND password_hash=$2
      RETURNING id, username, email
      `,
      [username, password],
    );
    if (!rows.length) {
      throw new LoginError('Invalid user/password.');
    }
    return NextResponse.json(rows[0]);
  } catch (error) {
    return respondWithError(error as Error);
  }
}
