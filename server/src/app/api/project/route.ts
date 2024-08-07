import { initializeNewProject } from '../../../db/shader';
import { NextResponse } from 'next/server';

// /**
//  * Obtains all shaders
//  */
// export async function GET() {
//   const params = {
//     user: 1,
//   };
//   const { rows } = await sql`SELECT * FROM shader`;
//   return NextResponse.json({
//     rows,
//   });
// }

/**
 * Create a new shader project.
 */
export async function POST(request: Request) {
  const requestJson = await request.json();
  const { project_name, file_name, code } = requestJson;
  const { project, file, version } = await initializeNewProject(
    project_name,
    file_name,
    code,
  );
  // console.log(project, file, version);
  console.log(project.id, file.id, version.id, version.code[0]);
  return NextResponse.json({
    project,
    file,
    version,
  });
}

// export async function PUT(request: Request) {
//   const { id, name, code } = await request.json();
//   const { rows } = await sql`
//     UPDATE shader
//     SET name = ${name}, code = ${code}
//     WHERE id = ${id}
//     RETURNING *
//     `;

//   return Response.json({
//     rows,
//   });
// }
