import pool from '@/db/pool';

export async function createProjectForUser(
  user_id: number,
  name: string,
  description: string,
  code: string,
) {
  const { rows } = await pool.query(
    `
    INSERT INTO Project (owner_id, name, description, code)
    VALUES ($1, $2, $3, $4)
    RETURNING *
    `,
    [user_id, name, description, code],
  );
  return rows[0];
}

export async function getProjectsForUser(user_id: number) {
  const { rows } = await pool.query(
    `
    SELECT *
    FROM Project
    WHERE owner_id=$1
    `,
    [user_id],
  );
  return rows;
}

export async function getProject(id: number) {
  const { rows } = await pool.query(
    `
    SELECT *
    FROM Project
    WHERE id=$1
    `,
    [id],
  );
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
  return rows[0];
}
