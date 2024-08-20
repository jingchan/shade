import { createFileRoute } from '@tanstack/react-router';
import ShadeEdit from '@/components/shader/ShadeEdit';
import RenderingContextProvider from '@/components/providers/RenderingContext';

export const Route = createFileRoute('/shade')({
  component: () => ShadePage(),
});

export default function ShadePage() {
  return (
    <>
      <RenderingContextProvider>
        <ShadeEdit />
      </RenderingContextProvider>
    </>
  );
}
