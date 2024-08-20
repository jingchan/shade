'use client';

import { FpsReporter } from '@/play/fpsReporter';
import { RequestAnimationFrameLooper } from '@/play/loop';
import { useEffect, useRef, useState } from 'react';
import {
  getWebGpuContextAndAttachDevice,
  RenderPipeline,
  RenderTarget,
  ShaderModule,
} from 'shade-common';
import ShaderCode from 'shade-common/src/shader/shaderCode';

interface RenderViewProps {
  shader_code: ShaderCode;
  device: GPUDevice;
  showStats?: boolean;
}

// TODO: Resize canvas buffer to match canvas size.
export default function RenderView({
  shader_code,
  device,
  showStats = true,
}: RenderViewProps) {
  const [fps, setFps] = useState<number | null>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const canvasContext = useRef<GPUCanvasContext>();
  const reporter = useRef<FpsReporter>(new FpsReporter(setFps));
  // const looper = useRef<Looper>(new RequestAnimationFrameLooper(mainLoop));
  const [pipeline, setPipeline] = useState<RenderPipeline | null>(null);

  // function mainLoop(time: number, frame: number) {
  //   if (!canvasContext.current) {
  //     return;
  //   }
  //   if (pipeline) {
  //     const { uniformBuffer, uniformBindGroup } = pipeline.createUniforms();
  //     const target = new RenderTarget(device, canvasContext.current);

  //     pipeline.draw(time, target, uniformBuffer, [uniformBindGroup]);
  //   }

  //   reporter.current.tick();
  // }

  useEffect(() => {
    console.log('pipeline effect', pipeline, canvasContext);
    const context = canvasContext.current;
    if (!pipeline || !context) {
      return;
    }

    const looper = new RequestAnimationFrameLooper((time, _frame) => {
      const { uniformBuffer, uniformBindGroup } = pipeline.createUniforms();
      const target = new RenderTarget(device, context);
      pipeline.draw(time, target, uniformBuffer, [uniformBindGroup]);
      reporter.current.tick();
    });
    looper.start();
    return () => {
      looper.stop();
    };
  }, [canvasContext, pipeline]);

  useEffect(() => {
    if (!shader_code) {
      return;
    }
    const shader = new ShaderModule(device, shader_code);
    RenderPipeline.build(device, shader, shader).then(setPipeline);
  }, [shader_code]);

  useEffect(() => {
    const canvasEl = canvas.current;
    if (!canvasEl) {
      return;
    }
    canvasContext.current = getWebGpuContextAndAttachDevice(canvasEl, device);
  }, []);

  return (
    <div className="relative aspect-square">
      <canvas ref={canvas} className="bg-orange-50 w-full h-full" />
      {showStats && (
        // <div className="absolute top-0 text-gray-400 shadow-sm">
        <div className={'devinfo absolute bottom-0 right-0 shadow px-1 '}>
          <div className="">fps: {fps?.toFixed(1)}</div>
        </div>
      )}
    </div>
  );
}
