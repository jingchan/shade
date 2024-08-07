import { sql } from '@vercel/postgres';

export async function getAllShaders() {
  return await sql`SELECT * FROM ShaderFile`;
}

export async function getShaderById(id: number) {
  return await sql`SELECT * FROM ShaderFile WHERE id = ${id}`;
}
