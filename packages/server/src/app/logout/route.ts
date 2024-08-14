import { logout } from '@/actions/session';
import { URL } from 'url';

/**
 * GET /logout
 */
export async function GET(request: Request) {
  const { origin: baseUrl } = new URL(request.url);
  await logout();
  // const cookieStore = cookies();
  // cookieStore.set(SESSION_COOKIE_KEY, '', { expires: new Date(0) });

  return Response.redirect(baseUrl);
}
