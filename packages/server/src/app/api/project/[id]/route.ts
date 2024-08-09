import { NextResponse, type NextRequest } from 'next/server';
import { intFromString } from '../../validation';
import { NoProjectError, respondWithError } from '../../errors';
import pool from '@/db/pool';
import { ProjectData } from 'shade-common';

/**
 * GET /api/project/[id]
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } },
) {
  const id = intFromString(params.id);
  try {
    const { rows } = await pool.query(
      `
    SELECT *
    FROM Project
    WHERE id=$1
    `,
      [id],
    );
    if (!rows.length) {
      throw new NoProjectError(`No project.`);
    }
    return NextResponse.json(rows[0]);
  } catch (error) {
    return respondWithError(error as Error);
  }
}

/**
 * PATCH /api/project/[id]
 */
const updateKeys = ['name', 'description', 'code'];
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const id = intFromString(params.id);
  const updates = (await req.json()) as ProjectData;

  const fields = Object.keys(updates)
    .filter((key) => updateKeys.includes(key))
    .filter((key) => updates[key as keyof ProjectData] !== undefined);
  const values = fields.map((key) => updates[key as keyof ProjectData]);

  if (fields.length === 0) {
    return NextResponse.json(
      { message: 'No valid fields provided for update' },
      { status: 400 },
    );
  }

  const setQuery = fields
    .map((field, index) => `${field} = $${index + 1}`)
    .join(', ');
  const query = `UPDATE Project SET ${setQuery}, updated_at = NOW() WHERE id = $${fields.length + 1} RETURNING *`;
  console.log(query);

  const { rows } = await pool.query(query, [...values, id]);
  if (rows.length === 0) {
    return Response.json({ message: 'Project not found' }, { status: 404 });
  }
  return Response.json(rows[0]);
}

/**
 * DELETE /api/project/[id]
 */
export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } },
) {
  await pool.query('DELETE FROM projects WHERE id = $1', [params.id]);
  return NextResponse.json({}, { status: 204 });
}
