// import { sql } from "@vercel/postgres";
// import { type NextRequest } from "next/server";
// import { getShaderById } from "../../../src/db"; // Replace with your database function
// import { StatusCode } from "@/app/statusCode";

// export default async function GET(
//   req: NextRequest,
//   { params }: { params: { id: string } }
// ) {
//   const id = Number.parseInt(params.id);
//   if (!id) {
//     return Response.json({ error: "Invalid ID" });
//   }

//   try {
//     const user = await getShaderById(id);
//     if (!user) {
//       return Response.json(
//         { message: "User not found." },
//         { status: StatusCode.NOT_FOUND }
//       );
//     }
//     return Response.json({ data: user });
//   } catch (error) {
//     console.error(`Error obtaining shader by id: ${id}:`, error);
//     return Response.json(
//       { message: "Internal Server Error." },
//       { status: StatusCode.INTERNAL_SERVER_ERROR }
//     );
//   }
// }

// export async function PUT(request: Request) {
//   const { id, name, email, password } = await request.json();
//   const { rows } = await sql`
//     UPDATE user
//     SET name = ${name}, email = ${email}, password = ${password}
//     WHERE id = ${id}
//     RETURNING *
//     `;

//   return Response.json(
//     {
//       data: rows[0],
//     },
//     {
//       status: StatusCode.OK,
//     }
//   );
// }

// export async function PATCH(request: Request) {
//   const { id, ...requestJson } = await request.json();
//   let updatedFields = [];

//   // check if field exists (not just truthy) on requestJson:
//   for (const field of ["name", "email", "password"]) {
//     if (Object.hasOwn(requestJson, field)) {
//       updatedFields.push(field);
//     }
//   }

//   const { rows } = await sql`
//     UPDATE user
//     SET ${updatedFields
//       .map((field) => `${field} = ${requestJson[field]}`)
//       .join(", ")}
//     WHERE id = ${id}
//     RETURNING *
//     `;

//   return Response.json(
//     {
//       data: rows[0],
//     },
//     {
//       status: StatusCode.OK,
//     }
//   );
// }
