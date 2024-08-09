// import pool from '@/db/pool';
// import { NextResponse } from 'next/server';
// import { respondWithError, SignUpError } from '../errors';

// /**
//  * POST /user/signup
//  */
// export async function POST(request: Request) {
//   const requestJson = await request.json();
//   const { username, email, password } = requestJson;

//   try {
//     const { rows } = await pool.query(
//       `
//     INSERT INTO Account (username, email, password_hash)
//     VALUES ($1, $2, $3)
//     RETURNING id, username, email
//     `,
//       [username, email, password],
//     );
//     console.log('rows ', rows);
//     if (!rows.length) {
//       throw new SignUpError("Couldn't create new account.");
//     }
//     return NextResponse.json(rows[0]);
//   } catch (error) {
//     return respondWithError(error as Error);
//   }
// }
