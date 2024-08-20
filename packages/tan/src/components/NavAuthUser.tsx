import { User } from 'shade-common';
import UserIcon from './icons/user';

export interface NavAuthUserProps {
  user: User;
}

export default function NavAuthUser({ user }: NavAuthUserProps) {
  return (
    <div className="relative flex text-gray-800">
      <UserIcon /> {user.username}
      <a
        className={
          'top-0 z-20 right-0 border bg-white text-red-400 p-4 rounded-lg ' +
          'hover:bg-gray-50 select-none'
        }
        href="/logout"
      >
        Logout
      </a>
    </div>
  );
}
