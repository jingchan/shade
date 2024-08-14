import NavAuthUser from './NavAuthUser';
import { getSession } from '@/actions/session';

export default async function NavAuthWidget() {
  const { user } = await getSession();
  if (user) {
    return <NavAuthUser user={user} />;
  } else {
    return (
      <>
        <a
          href="/login"
          className={
            'xl:inline-flex font-medium rounded-lg text-sm px-5 py-2.5 text-center ml-1 sm:ml-3 ' +
            'text-blue-700 ' +
            'hover:bg-blue-700/20 ' +
            'focus:ring-4 focus:ring-blue-300 ' +
            'border-2 border-blue-700'
          }
        >
          Login
        </a>
        <a
          href="/join"
          className={
            'xl:inline-flex font-medium rounded-lg text-sm px-5 py-2.5 text-center ml-1 sm:ml-3 ' +
            'text-white ' +
            'bg-blue-700 hover:bg-blue-800 ' +
            'focus:ring-4 focus:ring-blue-300 ' +
            'border-2 border-blue-700'
          }
        >
          Get Started
        </a>
      </>
    );
  }
}
