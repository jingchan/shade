// import { NoProjectError } from '@/app/api/errors';
// import pool from './pool';

// export async function GET() {
//   const { rows } = await pool.query('SELECT * FROM Agent');
// }

// export async function fetchAllProjects() {
//   return await sql`SELECT * FROM Project`;
// }

// export async function fetchProject(id: number) {
//   return await sql`SELECT * FROM Project WHERE id = ${id}`;
// }

// export async function fetchProjectFile(id: number) {
//   return await sql`SELECT * FROM ProjectFile WHERE id = ${id}`;
// }

// export async function fetchProjectFiles(project_id: number) {
//   return await sql`SELECT * FROM File WHERE project_id = ${project_id}`;
// }

// interface FetchProjectOptions {
//   withFiles?: boolean;
// }

// export async function fetchProject(id: number, options?: FetchProjectOptions) {
//   if (options?.withFiles) {
//     const { rows } = await sql`
//     WITH ProjectFileJson AS (
//       SELECT
//         project.id AS project_id,
//         json_build_object(
//           'id', Project.id,
//           json_agg(
//             json_build_object(
//               'id', ProjectFile.id,
//               'name', ProjectFile.name,
//               'content', ProjectFile.content,
//               'created_at', ProjectFile.created_at,
//               'updated_at', ProjectFile.updated_at
//             )
//           )
//         ) as files
//       FROM Project
//       LEFT JOIN ProjectFile ON Project.id = ProjectFile.project_id
//       GROUP BY Project.id
//     )
//     SELECT
//       json_build_object(
//         'id', Project.id,
//         'name', Project.name,
//         'description', Project.description,
//         'created_at', Project.created_at,
//         'updated_at', Project.updated_at,
//         'files', ProjectFileJson.files
//       ) AS project
//     FROM Project
//     LEFT JOIN ProjectFileJson ON Project.id = ProjectFileJson.project_id
//     WHERE Project.id = ${id}
//     `;
//     if (rows.length === 0) {
//       throw new NoProjectError(`Project with id ${id} not found.`);
//     }
//     return rows[0];
//   } else {
//     throw new Error('Not implemented');
//   }
// }

// export async function createProject(name: string) {
//   const { rows } = await sql`
//     INSERT INTO Project (name)
//     VALUES (${name})
//     RETURNING *
//     `;

//   return rows[0];
// }

// export async function createProjectFile(project_id: number, name: string) {
//   const { rows } = await sql`
//     INSERT INTO ProjectFile (project_id, name)
//     VALUES (${project_id}, ${name})
//     RETURNING *
//     `;

//   return rows[0];
// }

// export async function createProjectFileVersion(_file_id: number, code: string) {
//   const { rows } = await sql`
//     INSERT INTO ProjectFileVersion (_file_id, code)
//     VALUES (${_file_id}, ${code})
//     RETURNING *
//     `;

//   return rows[0];
// }

// export async function initializeNewProject(
//   name: string,
//   description: string,
//   code: string,
// ) {
//   const project = await createProject(project_name);
//   const file = await createProjectFile(project.id, file_name);
//   const version = await createProjectFileVersion(file.id, code);
//   const { rows } = await pool.query(
//     `
//     INSERT INTO Project (name, traits, interests, profession, speech_style)
//     VALUES ($1, $2, $3, $4, $5)
//     RETURNING *
//     `,
//     [name, traits, interests, profession, speech_style],
//   );

//   return {
//     project,
//     file,
//     version,
//   };
// }

// export async function POST(request: Request) {
//   const { name, traits, interests, profession, speech_style } =
//     await request.json();
//   const { rows } = await pool.query(
//     `
//     INSERT INTO Agent (name, traits, interests, profession, speech_style)
//     VALUES ($1, $2, $3, $4, $5)
//     RETURNING *
//     `,
//     [name, traits, interests, profession, speech_style]
//   );

//   return Response.json({
//     rows,
//   });
// }
