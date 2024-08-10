import { createContext } from 'react';

export const RenderContext = createContext<GPUDevice | null>(null);
