'use client';
import { useContext } from 'react';
import RenderView from './RenderView';
import { RenderingContext } from '@/components/providers/RenderingContext';

export default function ShaderThumb() {
  const device = useContext(RenderingContext);

  return (
    <div className="xd">
      <div className="title">name</div>
      {device && <RenderView device={device} renderPipeline={null} />}
    </div>
  );
}

// <div class="container">
//   <div class="title">{{ name }}</div>
//   <div class="canvas-container">
//     <RenderView
//       :name="name"
//       :rendererConstructor="rendererConstructor"
//       :options="options"
//       :shaderCode="shaderCode"
//     />
//   </div>
// </div>
