import ShaderGrid from '@/components/shader/ShadeGrid';
import { createLazyFileRoute } from '@tanstack/react-router';
import { Project, User } from 'shade-common';

export const Route = createLazyFileRoute('/')({
  component: Index,
});

function Index() {
  const loggedInUser: User | null = null;
  return <>{loggedInUser ? <Content /> : <NewUserWelcome />}</>;
}

function Content() {
  // const projects = await getSessionProjects();
  const projects: Project[] = [];
  return (
    <div className="container flex flex-col">
      <div className="flex">{/* <NewProjectButton /> */}</div>
      <ShaderGrid projects={projects} />
    </div>
  );
}

function NewUserWelcome() {
  return (
    <div className="container flex flex-col items-center justify-center w-full h-full">
      <p className="text-lg text-gray-600">
        Join the best community of shader developers.
      </p>
      <p className="text-lg text-gray-600">
        {/* Please <Link href={'/join'}>sign up</Link> to get started. */}
      </p>
    </div>
  );
}
