import pool from '@/db/pool';
import { NextResponse } from 'next/server';
import { NoProjectError, respondWithError } from '../errors';
import { getSession } from '@/actions/session';

/**
 * GET /api/myprojects
 */
export async function POST(request: Request) {
  const session = await getSession();
  if (!session.user) {
    return NextResponse.error(new Error('Not logged in.'));
  }
  const user_id = session.user.id;
  const requestJson = await request.json();
  const { name, description, code } = requestJson;
  try {
    const { rows } = await pool.query(
      `
    INSERT INTO Project (owner_id, name, description, code)
    VALUES ($1, $2, $3, $4)
    RETURNING *
    `,
      [user_id, name, description, code],
    );
    if (!rows.length) {
      throw new NoProjectError(`Couldn't create new project.`);
    }
    console.log('rows', rows[0]);
    return NextResponse.json(rows[0]);
  } catch (error) {
    return respondWithError(error as Error);
  }
}
