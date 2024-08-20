'use client';
import { createContext, useEffect, useState } from 'react';
import { requestDeviceFromBrowser } from 'shade-common';

export const RenderingContext = createContext<GPUDevice | null>(null);

export default function RenderingContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [device, setDevice] = useState<GPUDevice | null>(null);

  useEffect(() => {
    requestDeviceFromBrowser().then(setDevice);
  }, []);

  return (
    <RenderingContext.Provider value={device}>
      {children}
    </RenderingContext.Provider>
  );
}
