<script setup lang="ts">
import { computed } from 'vue';
import { RendererConstructor } from '../../render/renderer';
import ShaderCode from '../../shader/shaderCode';
import RenderView, { RenderViewOptions } from './RenderView.vue';

interface Props {
  name: string;
  rendererConstructor: RendererConstructor;
  options: RenderViewOptions;
}
const props = defineProps<Props>();

const shaderCode = computed(
  () => props.options?.vertexShader || ShaderCode.default(),
);
</script>

<template>
  <div class="container">
    <div class="title">{{ name }}</div>
    <div class="canvas-container">
      <RenderView
        :name="name"
        :rendererConstructor="rendererConstructor"
        :options="options"
        :shaderCode="shaderCode"
      />
    </div>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  /* margin: 0.2em; */
  /* box-sizing: content-box; */
  margin-bottom: 0.1em;
  background-color: rgb(83, 83, 83);
  background-color: rgb(255, 255, 255);
  box-shadow: 3px 3px 6px 2px rgba(0, 0, 0, 0.4);
  font-size: 0.8em;
}

.title {
  color: rgb(30, 30, 30);
  padding: 0.2rem 0;
  text-align: center;
  width: 100%;
  text-wrap: wrap;
  background-color: rgba(250, 250, 250, 0.1);
  font-size: 1rem;
  font-weight: 100;
  font-family: Arial, Helvetica, sans-serif;
  letter-spacing: 0.06rem;
  line-height: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.canvas-container {
  width: 100%;
  flex-grow: 1;
}
.canvas {
  display: block;
  width: 100%;
  aspect-ratio: 1 / 1;
}
</style>
