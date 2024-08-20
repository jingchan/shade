import { NextResponse } from 'next/server';
import { respondWithError } from '../../errors';
import { getSession } from '@/actions/session';

/**
 * POST /auth/logout
 */
export async function POST(_request: Request) {
  try {
    const session = await getSession();
    if (session.user) {
      session.user = null;
      await session.save();
    }
    session.destroy();

    return NextResponse.json({}, { status: 200 });
  } catch (error) {
    return respondWithError(error as Error);
  }
}
