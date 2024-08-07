<script setup lang="ts">
import { onMounted, provide, Ref, ref, shallowRef } from 'vue';

import { useRoute } from 'vue-router';
import ShaderCode from '../../shader/shaderCode';
import { BaseRenderer } from '../../render/base';
import EditorView from './EditorView.vue';
import RenderView from './RenderView.vue';
import clamp from '../../utils/clamp';
import { MonacoEditor } from '../../edit/monaco';
import router from '../../router';

const emit = defineEmits<{
  contentChanged: [code: string];
}>();
const mainEl = ref<HTMLElement | null>(null);
const monacoEditor = shallowRef(new MonacoEditor());

const API_URL = 'http://localhost:3001/api/project';
const route = useRoute();
route.params;

const shader_id: Ref<string> = ref(
  route.params.id instanceof Array ? route.params.id[0] : route.params.id,
);

const initialCode = ref<ShaderCode>();
const currentCode = ref<ShaderCode>();
const isEdited = ref(false);
const notFound = ref(false);

function handleContentChanged(newCode: string) {
  currentCode.value = new ShaderCode(newCode);
  isEdited.value = true;
  console.log('ShaderPage: Received content changed', newCode.length);
  emit('contentChanged', newCode);
}

async function handleSaveButtonPressed() {
  console.log('Save button pressed');
  isEdited.value = false;

  // If id is set, save
  if (shader_id.value) {
    const response = await fetch(API_URL + '/' + shader_id.value, {
      method: 'PUT',
      body: JSON.stringify({
        code: currentCode.value?.userSource,
      }),
    });
    const { rows } = await response.json();
    console.log(rows);
    return;
  } else {
    const response = await fetch(API_URL, {
      method: 'POST',
      body: JSON.stringify({
        project_name: 'New project',
        file_name: 'main.wgsl',
        code: currentCode.value?.userSource,
      }),
    });
    console.log('post respose', response);
    const { project, file, version } = await response.json();

    console.log(project, file, version);

    // const { id, name, code } = rows[0];
    console.log(`saved as ${project.id}`);
    router.replace(`/shader/${project.id}`);
  }
}

onMounted(async () => {
  const id = shader_id.value;
  console.log('id is', id);
  if (!id) {
    // If no id, load default starting template.
    initialCode.value = ShaderCode.default();
    return;
  } else {
    // Else, fetch shader code from server.
    const response = await fetch(`${API_URL}/${id}`);
    if (response.status === 200) {
      const responseJson = await response.json();
      console.log('fetched with:', responseJson);
      // const data = response.json();
      // return ShaderCode.default();
      console.log('responseJson', responseJson);
      if (responseJson.rows.length >= 1) {
        initialCode.value = new ShaderCode(responseJson.rows[0].code);
      }
    }
    notFound.value = true;
    return;
  }
});

/**
 * Split layout scripts
 *
 * TODO: Separate into component.
 */
const LAYOUT_SPLIT_DEFAULT = 0.5;
const LAYOUT_SPLIT_MIN_RATIO = 0.2;
const LAYOUT_SPLIT_MAX_RATIO = 0.8;

// So editor can be triggered to recompute layout.
const splitRatio = ref(LAYOUT_SPLIT_DEFAULT);
function updateSplitRatio(newRatio: number) {
  splitRatio.value = clamp(
    newRatio,
    LAYOUT_SPLIT_MIN_RATIO,
    LAYOUT_SPLIT_MAX_RATIO,
  );
}
provide('splitRatio', {
  splitRatio,
});

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
    <div v-if="notFound" class="not-found">
      <h1>Shader not found</h1>
    </div>
    <div v-else class="left" :style="{ width: `${splitRatio * 100}%` }">
      <div class="preview">
        <RenderView
          :rendererConstructor="BaseRenderer"
          :shaderCode="currentCode || initialCode"
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
      <div class="toolbar">
        <button
          type="button"
          class="btn"
          :disabled="!isEdited"
          @click="handleSaveButtonPressed"
        >
          Save
        </button>
      </div>
      <EditorView
        v-if="initialCode"
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

.left {
  position: relative;
}
.preview {
}
.edit {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  height: 100%;
  position: relative;
  /* padding: 0.3rem; */
}

.toolbar {
  background-color: #1e1e1e;
  padding: 0.5rem;
}

.btn {
  background-color: #4caf50;
  color: white;
  padding: 0.5rem;
  border: none;
  cursor: pointer;
  user-select: none;
  border-radius: 4px;
}
.btn:hover {
  background-color: #45a049;
}
.btn:active {
  background-color: #3e8e41;
}
.btn:disabled {
  background-color: #a0a0a0;
  cursor: not-allowed;
}

/**
 * Divider styles
 **/
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
  animation: divider-glow 0.6s infinite alternate ease-in;
}
@media (min-width: 800px) {
  .divider-inner {
    width: 8px;
    left: -4px;
  }
}
@keyframes divider-glow {
  0% {
    background-color: rgb(111, 146, 251);
  }
  100% {
    background-color: rgb(45, 84, 201);
    /* background-color: rgb(106, 126, 255); */
    /* background-color: rgb(72, 76, 88); */
  }
}
.divider .nub {
  width: 2px;
  height: 2px;
  background-color: rgba(255, 255, 255, 0.4);
  box-shadow: 2px 2px 0 1px rgba(0, 0, 0, 0.1);
}
</style>
