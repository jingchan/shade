import NavBar from '../components/NavBar';
import { getSessionProjects, getSession } from '@/actions/session';
import NewProjectButton from '@/components/NewProjectButton';
import Link from 'next/link';
import ShaderGrid from '@/components/shader/ShadeGrid';

export default async function Home() {
  const session = await getSession();
  const loggedInUser = session.user?.id;

  return (
    <main className="flex flex-col items-center h-full min-h-full">
      <NavBar />
      {loggedInUser ? <Content /> : <NewUserWelcome />}
    </main>
  );
}

async function Content() {
  const projects = await getSessionProjects();
  return (
    <div className="container flex flex-col">
      <div className="flex">
        <NewProjectButton />
      </div>
      <ShaderGrid projects={projects} />
    </div>
  );
}

async function NewUserWelcome() {
  return (
    <div className="container flex flex-col items-center justify-center w-full h-full">
      <p className="text-lg text-gray-600">
        Join the best community of shader developers.
      </p>
      <p className="text-lg text-gray-600">
        Please <Link href={'/join'}>sign up</Link> to get started.
      </p>
    </div>
  );
}
