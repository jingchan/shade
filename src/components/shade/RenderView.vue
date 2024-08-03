<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';
import {
  Renderer,
  RendererConstructor,
  RendererContext,
  setupDevice,
  setupWebGpuContext,
} from '../../render/renderer';
import { RenderTarget } from '../../render/rendertarget';
import { Size } from '../../types';
import { BaseRendererOptions } from '../../render/base';
import { ShaderCode } from '../../shader';

export interface RenderViewOptions extends Partial<BaseRendererOptions> {
  image?: string;
  scale?: number;
}

interface Props {
  name?: string;
  rendererConstructor: RendererConstructor;
  options?: RenderViewOptions;
  shaderCode: ShaderCode;
}

const props = defineProps<Props>();
console.log('initial', props);

const canvasEl = ref<HTMLCanvasElement>();
const context = ref<RendererContext>();
const renderer = ref<Renderer>();
const frame = ref<number>(0);
let frameHandle: number = 0;
let frameTime: number = 0;
let devicePromise: Promise<GPUDevice> = setupDevice();

export interface SetupRenderingPipelineOptions {
  context: RendererContext;
  options?: RenderViewOptions;
}

watch(
  () => props.shaderCode,
  async () => {
    console.log('watchshaderCode', props);
    console.log(
      'RenderView: ShaderCode Prop changed',
      props.shaderCode.userSource.length,
    );
    const device = await devicePromise;
    renderer.value = await setupRenderingPipeline(device, props.shaderCode);
  },
);

async function setupRenderingPipeline(
  device: GPUDevice,
  shaderCode: ShaderCode,
  _options?: RenderViewOptions,
) {
  const texture = await (async () => {
    if (!props.options?.image) {
      return;
    }
    const image = new Image();
    image.src = props.options.image;
    await new Promise((resolve) => {
      image.onload = resolve;
    });

    const bitmap = await createImageBitmap(image);
    const bitmapSize = new Size(bitmap.width, bitmap.height);
    const texture = device.createTexture({
      size: bitmapSize.as_array(true),
      // format: 'bgra8unorm' as GPUTextureFormat,
      format: 'rgba8unorm' as GPUTextureFormat,
      usage:
        GPUTextureUsage.COPY_DST |
        GPUTextureUsage.RENDER_ATTACHMENT |
        GPUTextureUsage.TEXTURE_BINDING,
    });
    device.queue.copyExternalImageToTexture(
      { source: bitmap },
      { texture },
      bitmapSize.as_array(true),
    );
    return texture;
  })();

  // Create Renderer.
  return new props.rendererConstructor(device, {
    ...props.options,
    texture,
    fragmentShader: shaderCode,
    vertexShader: shaderCode,
  });
}

/**
 * If new canvas, then re-attach device. (Rendering pipeline shouldn't need update.
 * If new code, then just replace rendering pipeline.
 **/
// async function setupWebGpuContext_TO_BE_REPLACED(
//   canvas: Ref<HTMLCanvasElement | undefined>,
// ) {
//   if (!canvas.value) {
//     throw new Error('No canvas element.');
//   }
//   context.value = await setupWebGpuContext(canvas.value);
//   context.value = context.value || (await setupWebGpuContext(canvas.value));
// }
// async function setupRenderingPipeline_TO_BE_REPLACED() {
//   if (!context.value) {
//     throw new Error('No context element.');
//   }

//   renderer.value =
//     renderer.value ||
//     (await setupRenderingPipeline(
//       context.value,
//       props.shaderCode,
//       props.options,
//     ));
//   // console.log('new renderer', props.shaderCode.userSource.length);
// }

function resizeCanvasColorBuffer() {
  console.log('resizing');
  // Resize backing colorbuffer if canvas size changed.
  if (!canvasEl.value) {
    throw new Error('No canvas element.');
  }
  const { width, height } = canvasEl.value;
  if (!width || !height) {
    throw new Error('No canvas width or height.');
  }
  const scale = props.options?.scale || 1;
  const scaledWidth = canvasEl.value?.clientWidth / scale;
  const scaledHeight = canvasEl.value?.clientHeight / scale;
  if (
    canvasEl.value?.width !== scaledWidth ||
    canvasEl.value?.height !== scaledHeight
  ) {
    canvasEl.value.width = scaledWidth;
    canvasEl.value.height = scaledHeight;
  }
}
//return vec4f(1.0);
async function startAnimationLoop() {
  let lastTime = performance.now();
  async function frameLoop(time: DOMHighResTimeStamp) {
    const deltaTime = time - lastTime;
    lastTime = time;
    frameTime += deltaTime;

    // TODO:  Only re-create when needed.  This creates a new depth every frame.
    // try {
    if (context.value && renderer.value) {
      const target = new RenderTarget(context.value, true);
      renderer.value.update(frameTime, target);
      renderer.value.renderFrame(target);
      frame.value++;
      // } catch (e) {
      //   errored = true;
      //   console.log(
      //     `Error (${props.name}): Caught error trying to get rendertarget.`,
      //     e,
      //   );

      //   context.value = undefined;
      // }
    } else {
      console.log('Rendering not ready');
    }
    frameHandle = requestAnimationFrame(frameLoop);
    // setTimeout(() => {
    //   frameHandle = requestAnimationFrame(frameLoop);
    // }, 1000);
  }
  frameHandle = requestAnimationFrame(frameLoop);
}
// onBeforeMount(async () => {
//   console.log('beforemount');
//   if (!device) {
//     device = await setupDevice();
//   }
// });
onMounted(async () => {
  console.log('mounted', props);
  if (canvasEl.value) {
    console.log('setupfrom mounted');
    console.log('shadercodename:', props.shaderCode?.name);
    const device = await devicePromise;
    context.value = await setupWebGpuContext(device, canvasEl.value);
    renderer.value = await setupRenderingPipeline(device, props.shaderCode);
  }
  startAnimationLoop();
  resizeCanvasColorBuffer();
});

onBeforeUnmount(() => {
  console.log('unmount');
  cancelAnimationFrame(frameHandle);
});
</script>

<template>
  <div class="canvas-container">
    <canvas ref="canvasEl" class="canvas" />
  </div>
  <div class="counter">{{ frame }}</div>
</template>

<style scoped>
.canvas-container {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 3em;
  aspect-ratio: 1 / 1;
}
.canvas {
  position: absolute;
  width: 100%;
  height: 100%;
  aspect-ratio: 1 / 1;
}
.counter {
  position: absolute;
  top: 0;
  left: 0;
  color: white;
  background-color: rgba(0, 0, 0, 0.5);
  padding: 0.5em;
}
</style>
