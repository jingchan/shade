import NavAuthUser from './NavAuthUser';
import { useContext } from 'react';
import { SessionContext } from './providers/SessionContext';
// import { getSession } from '@/actions/session';
// import { create } from 'zustand';
export default function NavAuthWidget() {
  const session = useContext(SessionContext);
  // const { user } = await getSession();
  // const fetcher = (url) => fetch(url).then((res) => res.json());
  // await fetcher('/api/auth/session');
  // console.log(res);
  if (session?.user) {
    return <NavAuthUser user={session.user} />;
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
