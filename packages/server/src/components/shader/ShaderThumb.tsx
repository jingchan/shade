import { useContext } from 'react';
import RenderView from './RenderView';
import { RenderContext } from '@/app/providers/RenderContext';

export default function ShaderThumb() {
  const device = useContext(RenderContext);

  return (
    <div className="xd">
      <div className="title">name</div>
      <RenderView device={device} />
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
