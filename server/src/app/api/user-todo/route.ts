// import { StatusCode } from "@/app/statusCode";
// import { sql } from "@vercel/postgres";
// import { NextResponse } from "next/server";

// /**
//  * Obtains all shaders
//  */
// export async function GET() {
//   const { rows } = await sql`SELECT * FROM User`;
//   return NextResponse.json({
//     rows,
//   });
// }

// /**
//  * Update shader.
//  */
// export async function POST(request: Request) {
//   const { username, email, password } = await request.json();
//   const { rows } = await sql`
//     INSERT INTO User (name, email, password)
//     VALUES (${username}, ${email}, ${password})
//     RETURNING *
//     `;

//   if (rows.length === 0) {
//     return NextResponse.json(
//       {
//         error: "User not created",
//       },
//       { status: StatusCode.BAD_REQUEST }
//     );
//   }

//   return NextResponse.json(
//     {
//       data: rows[0],
//     },
//     {
//       status: StatusCode.CREATED,
//     }
//   );
// }
