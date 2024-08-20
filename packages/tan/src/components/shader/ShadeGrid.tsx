'use client';
import ShaderThumb from './ShadeThumb';
import RenderingContextProvider from '@/components/providers/RenderingContext';

export default function ShaderGrid({ projects }) {
  return (
    <div
      className={
        'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 ' +
        'gap-4 p-4 w-full h-full'
      }
    >
      <RenderingContextProvider>
        {projects.map((i) => (
          <a key={i} href={'shade/'}>
            <ShaderThumb />
          </a>
        ))}
      </RenderingContextProvider>
    </div>
  );
}
