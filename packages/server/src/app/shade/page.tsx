'use client';

import ShaderThumb from '@/components/shader/ShaderThumb';
import NavBar from '../../components/NavBar';
import { RenderContext } from '../providers/RenderContext';
import { useEffect, useState } from 'react';
import { setupDevice } from 'shade-common';

export default function ShadePage() {
  const [device, setDevice] = useState<GPUDevice | null>(null);

  useEffect(() => {
    (async () => {
      setDevice(await setupDevice());
      console.log('setup device');
    })();
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center">
      <NavBar />

      <RenderContext.Provider value={device}>
        <div className="container">
          <div
            className="
          grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4  gap-4 p-4 w-full h-full
          "
          >
            {[1, 2, 3, 4, 5].map((i) => (
              <ShaderThumb key={i} />
            ))}
          </div>
        </div>
      </RenderContext.Provider>
    </main>
  );
}
