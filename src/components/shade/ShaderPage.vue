<script setup lang="ts">
import { computed, provide, Ref, ref, shallowRef } from 'vue';

import { useRoute } from 'vue-router';
import { DEFAULT_SHADER_CODE, ShaderCode, SHADERS } from '../../shader';
import { BaseRenderer } from '../../render/base';
import EditorView from './EditorView.vue';
import RenderView from './RenderView.vue';
import clamp from '../../utils/clamp';
import { isString } from '../../utils/string';
import { MonacoEditor } from '../../edit/monaco';

const emit = defineEmits<{
  contentChanged: [code: string];
}>();
const mainEl = ref<HTMLElement | null>(null);
const monacoEditor = shallowRef(new MonacoEditor());

const splitRatio = ref(0.5);
function updateSplitRatio(newRatio: number) {
  splitRatio.value = clamp(newRatio, 0.2, 0.8);
}
const route = useRoute();

// So editor can be triggered to recompute layout.
provide('splitRatio', {
  splitRatio,
});

function getShaderCode(id: string) {
  if (isString(id)) {
    return new ShaderCode(SHADERS[id]);
  }
  return new ShaderCode(DEFAULT_SHADER_CODE);
}

const shader_id: Ref<string> = ref(route.params.id as string);
const initialCode = computed(() => getShaderCode(shader_id.value));
const editedCode = ref<ShaderCode>(getShaderCode(shader_id.value));

function handleContentChanged(newCode: string) {
  editedCode.value = new ShaderCode(newCode);
  console.log('ShaderPage: Received content changed', newCode.length);
  emit('contentChanged', newCode);
}

function handleMouseDown(event: MouseEvent) {
  event.preventDefault();
  const abortMouseTracking = new AbortController();
  window.addEventListener(
    'mousemove',
    (event: MouseEvent) => {
      event.preventDefault();
      if (!mainEl.value) {
        return;
      }
      updateSplitRatio(event.clientX / mainEl.value.clientWidth);
    },
    {
      signal: abortMouseTracking.signal,
    },
  );
  window.addEventListener('mouseup', () => abortMouseTracking.abort(), {
    once: true,
  });
}

function handlePointerDown(event: PointerEvent) {
  event.preventDefault();
  event.stopPropagation();
  const abortPointerTracking = new AbortController();
  window.addEventListener(
    'pointermove',
    (event: PointerEvent) => {
      event.preventDefault();
      event.stopPropagation();
      if (!mainEl.value) {
        return;
      }
      updateSplitRatio(event.clientX / mainEl.value.clientWidth);
    },
    {
      signal: abortPointerTracking.signal,
    },
  );
  window.addEventListener('pointerup', () => abortPointerTracking.abort(), {
    once: true,
  });
}
</script>

<template>
  <div ref="mainEl" class="main">
    <div class="left" :style="{ width: `${splitRatio * 100}%` }">
      <div class="preview">
        <RenderView
          :rendererConstructor="BaseRenderer"
          :shaderCode="editedCode"
        />
      </div>
    </div>
    <div class="divider">
      <div
        class="divider-inner"
        @mousedown="handleMouseDown"
        @pointerdown="handlePointerDown"
      >
        <div class="nub"></div>
        <div class="nub"></div>
        <div class="nub"></div>
        <div class="nub"></div>
        <div class="nub"></div>
        <div class="nub"></div>
      </div>
    </div>
    <div class="edit">
      <EditorView
        :content="initialCode?.userSource"
        :editor="monacoEditor"
        @contentChanged="handleContentChanged"
      />
    </div>
  </div>
</template>

<style scoped>
.main {
  display: flex;
  height: 100%;
  width: 100%;
  background-color: gray;
  overflow: hidden;
}
.divider {
  position: relative;
}
.divider-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3px;
  width: 16px;
  height: 100%;
  background-color: rgb(111, 146, 251);
  cursor: ew-resize;
  position: absolute;
  left: -8px;
  opacity: 0;
  z-index: 1;
  box-shadow:
    inset -1px 0 1px 0 rgba(0, 0, 0, 0.2),
    inset 1px 0 1px 0 rgba(255, 255, 255, 0.3),
    1px 0 3px 0 rgba(0, 0, 0, 0.4);
  transition:
    opacity 1s,
    background-color 1s;
  touch-action: none;
}
.divider-inner:hover {
  opacity: 1;
  animation: glow 0.6s infinite alternate ease-in;
}

@media (min-width: 800px) {
  .divider-inner {
    width: 8px;
    left: -4px;
  }
}

@keyframes glow {
  0% {
    background-color: rgb(111, 146, 251);
  }
  100% {
    background-color: rgb(45, 84, 201);
    /* background-color: rgb(106, 126, 255); */
    /* background-color: rgb(72, 76, 88); */
  }
}

.nub {
  width: 2px;
  height: 2px;
  background-color: rgba(255, 255, 255, 0.4);
  box-shadow: 2px 2px 0 1px rgba(0, 0, 0, 0.1);
}

.left {
  position: relative;
}
.preview {
}
.edit {
  flex-grow: 1;
  height: 100%;
  position: relative;
  /* padding: 0.3rem; */
}
</style>
