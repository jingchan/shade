import { NoProjectError } from '@/app/api/errors';
import pool from '@/db/pool';

export async function getProject(id: number) {
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
  console.log('rows', rows);
  return rows[0];
}

export async function createProject(
  name: string,
  description: string,
  code: string,
) {
  const { rows } = await pool.query(
    `
    INSERT INTO Project (name, description, code)
    VALUES ($1, $2, $3)
    RETURNING *
    `,
    [name, description, code],
  );
  if (!rows.length) {
    throw new NoProjectError(`Unable to create a new project.`);
  }
  return rows[0];
}

export async function updateProject(
  name: string,
  description: string,
  code: string,
) {
  const { rows } = await pool.query(
    `
    INSERT INTO Project (name, description, code)
    VALUES ($1, $2, $3)
    RETURNING *
    `,
    [name, description, code],
  );
  if (!rows.length) {
    throw new NoProjectError(`Unable to create a new project.`);
  }
  return rows[0];
}
