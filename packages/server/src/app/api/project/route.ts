import pool from '@/db/pool';
import { NextResponse } from 'next/server';
import { NoProjectError, respondWithError } from '../errors';

/**
 * POST /api/project
 */
export async function POST(request: Request) {
  const requestJson = await request.json();
  const { name, description, code } = requestJson;
  try {
    const { rows } = await pool.query(
      `
    INSERT INTO Project (name, description, code)
    VALUES ($1, $2, $3)
    RETURNING *
    `,
      [name, description, code],
    );
    if (!rows.length) {
      throw new NoProjectError(`Couldn't create new project.`);
    }
    return NextResponse.json(rows[0]);
  } catch (error) {
    return respondWithError(error as Error);
  }
}
