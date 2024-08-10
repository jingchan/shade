'use client';

import { FpsReporter } from '@/play/fpsReporter';
import { Looper, RequestAnimationFrameLooper } from '@/play/loop';
import { useEffect, useRef, useState } from 'react';
import { getWebGpuContextAndAttachDevice } from 'shade-common';

interface RenderViewProps {
  shader_id?: number;
  device: GPUDevice | null;
  showStats?: boolean;
}

// /**
//  * Utility function that will call the provided function at a fixed interval.
//  */
// function renderLoop(loop_fn: (time: number) => void, interval?: number) {
//   let frameHandle: number;
//   let timeoutHandle: number;
//   let frameTime = 0.0;

//   let lastTime = performance.now();
//   async function frame(time: DOMHighResTimeStamp) {
//     const deltaTime = time - lastTime;
//     lastTime = time;
//     frameTime += deltaTime;

//     loop_fn(frameTime);

//     if (interval) {
//       timeoutHandle = window.setTimeout(() => {
//         frameHandle = requestAnimationFrame(frame);
//       }, 1000);
//     } else {
//       frameHandle = requestAnimationFrame(frame);
//     }
//   }
//   frameHandle = requestAnimationFrame(frame);

//   return () => {
//     console.log('cleanup');
//     clearTimeout(timeoutHandle);
//     cancelAnimationFrame(frameHandle);
//   };
// }

// TODO: Resize canvas buffer to match canvas size.
export default function RenderView(props: RenderViewProps) {
  const [fps, setFps] = useState<number | null>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const canvasContext = useRef<GPUCanvasContext | null>(null);
  const reporter = useRef<FpsReporter>(new FpsReporter(setFps));
  const looper = useRef<Looper>(new RequestAnimationFrameLooper(mainLoop));

  function mainLoop(_time: number, _frame: number) {
    if (!canvasContext.current) {
      return;
    }
    // TODO: Call Rendering

    reporter.current.tick();
  }

  useEffect(() => {
    looper.current.start();
    return () => {
      looper.current?.stop();
    };
  }, []);

  useEffect(() => {
    const device = props.device;
    const canvasEl = canvas.current;
    if (!device || !canvasEl) {
      return;
    }
    canvasContext.current = getWebGpuContextAndAttachDevice(canvasEl, device);
  }, [canvas, props.device]);

  return (
    <div className="relative aspect-square">
      <canvas ref={canvas} className="bg-orange-50 w-full h-full" />
      {props.showStats && (
        <div className="absolute top-0 bg-[#0003]">
          <div className="">fps: {fps?.toFixed(1)}</div>
        </div>
      )}
    </div>
  );
}
