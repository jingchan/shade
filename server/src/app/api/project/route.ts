import { initializeNewProject } from '@/db/project';
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
  const { name, description, code } = requestJson;
  const resultRow = await initializeNewProject(name, description, code);
  // console.log(project, file, version);
  console.log(resultRow);
  return NextResponse.json(resultRow);
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
