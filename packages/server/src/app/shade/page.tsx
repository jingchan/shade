import ShadeEdit from '@/components/shader/ShadeEdit';
import NavBar from '../../components/NavBar';

export default function ShadePage() {
  return (
    <main className="flex flex-col items-center h-full">
      <NavBar />
      <ShadeEdit />
    </main>
  );
}
