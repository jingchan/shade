import { getSession } from '@/actions/session';

// const InvalidSessionToken = {
//   error: 'Invalid session.',
// };

/**
 * GET /auth/session
 */
export async function GET(_request: Request) {
  // const requestJson = await request.json();
  const session = await getSession();
  if (session.user) {
    return Response.json({ user: session.user }, { status: 200 });
  } else {
    return Response.json({}, { status: 401 });
  }
}
