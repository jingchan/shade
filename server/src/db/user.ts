import { sql } from '@vercel/postgres';

export async function getUserById(id: number) {
  return await sql`SELECT * FROM User WHERE id = ${id}`;
}

export async function getAllUsers() {
  return await sql`SELECT * FROM User`;
}

export async function createUser(
  username: string,
  email: string,
  password: string,
) {
  const { rows } = await sql`
    INSERT INTO User (name, email, password)
    VALUES (${username}, ${email}, ${password})
    RETURNING *
    `;

  if (rows.length <= 0) {
    throw new Error('User not created');
  } else {
    return rows[0];
  }
}

// const UserFields = ['name', 'email', 'password'];

// export async function updateUser(id: number, fields: string[]) {
//   const updatedFields = [];

//   for (const field of UserFields) {
//     if (Object.hasOwn(fields, field)) {
//       updatedFields.push(field);
//     }
//   }

//   const { rows } = await sql`
//     UPDATE User
//     SET ${updatedFields
//       .map((field) => `${field} = ${fields[field]}`)
//       .join(', ')}
//     WHERE id = ${id}
//     RETURNING *
//     `;

//   if (rows.length <= 0) {
//     throw new Error('User not updated');
//   } else {
//     return rows[0];
//   }
// }
