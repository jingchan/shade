<script setup lang="ts">
import { onMounted, provide, ref, shallowRef, watch } from 'vue';

import { useRoute } from 'vue-router';
import ShaderCode from '../../shader/shaderCode';
import { BaseRenderer } from '../../render/base';
import EditorView from './EditorView.vue';
import RenderView from './RenderView.vue';
import clamp from '../../utils/clamp';
import { MonacoEditor } from '../../edit/monaco';
import router from '../../router';
import ShaderPageHeader from './ShaderPageHeader.vue';
import { useProjectApi } from '../../clientApi/useProjectApi';
import { ProjectData } from 'shade-common';

const props = defineProps<{
  id: string;
}>();
const emit = defineEmits<{
  contentChanged: [code: string];
}>();
const mainEl = ref<HTMLElement | null>(null);
const monacoEditor = shallowRef(new MonacoEditor());

const route = useRoute();
route.params;

// const param_id: Ref<string> = ref(
//   route.params.id instanceof Array ? route.params.id[0] : route.params.id,
// );

// Code that reflects the current state of the editor.
const initialCode = ref<ShaderCode>();
const renderedCode = ref<ShaderCode>();
const isEdited = ref(false);
const notFound = ref(false);

const { project, fetchProject, createProject, updateProject } = useProjectApi();
const currentProject = ref<ProjectData>();

function handleContentChanged(newCode: string) {
  renderedCode.value = new ShaderCode(newCode);
  isEdited.value = true;
  emit('contentChanged', newCode);
}

watch(currentProject, () => {
  console.log('currentProject changed', currentProject.value);
  if (currentProject.value) {
    initialCode.value = new ShaderCode(currentProject.value?.code);
  }
});

async function handleSaveButtonPressed() {
  isEdited.value = false;

  // If no id, create new, but otherwise, update.
  if (!project.value?.id) {
    await createProject(currentProject.value);
    if (!project.value) {
      isEdited.value = true;
      return;
    }
    router.replace(`/shader/${project.value.id}`);
  } else {
    project.value.code = renderedCode.value?.userSource || '';
    await updateProject(project.value?.id, project.value);
  }
}

onMounted(async () => {
  if (props.id === '') {
    currentProject.value = {
      name: 'New project',
      description: 'My new shader project.',
      code: ShaderCode.default().userSource,
    };
  }
  const id = parseInt(props.id);
  if (id) {
    await fetchProject(id);
  } else {
    router.replace('/shader');
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

function handleNameChanged(newName: string) {
  if (currentProject.value) {
    currentProject.value = {
      ...currentProject.value,
      name: newName,
    };

    // TODO: send update name
  }
}

// const {} = useSessionStorage('shader', { [param_id.value]: splitRatio.value });
</script>

<template>
  <div ref="mainEl" class="flex flex-col h-full">
    <ShaderPageHeader
      :project="currentProject"
      @nameChanged="handleNameChanged"
    />
    <div class="flex h-full">
      <div v-if="notFound" class="not-found">
        <h1>Shader not found</h1>
      </div>
      <div v-else class="relative" :style="{ width: `${splitRatio * 100}%` }">
        <div class="preview">
          <RenderView
            :rendererConstructor="BaseRenderer"
            :shaderCode="renderedCode || initialCode"
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
      <div class="flex flex-col w-full h-full">
        <div class="flex w-full">
          <button
            type="button"
            class="btn save"
            :disabled="!isEdited"
            @click="handleSaveButtonPressed"
          >
            Save
          </button>
          <button type="button" class="btn">Config</button>
        </div>
        <EditorView
          v-if="initialCode"
          :content="initialCode?.userSource"
          :editor="monacoEditor"
          @contentChanged="handleContentChanged"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
/* .main {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: gray;
} */
/* .body {
  display: flex;
  height: 100%;
}

.left {
  position: relative;
}
.edit {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  height: 100%;
  position: relative;
}

.toolbar {
  display: flex;
  justify-content: flex-end;
  background-color: #1e1e1e;
  padding: 0.5rem;
  gap: 0.4rem;
} */

/* .btn {
  background-color: #bababa;
  color: white;
  padding: 0.5rem;
  border: none;
  cursor: pointer;
  user-select: none;
  border-radius: 4px;
} */
/* .btn:hover {
  background-color: #45a049;
}
.btn:active {
  background-color: #3e8e41;
}
.btn:disabled {
  background-color: #a0a0a0;
  cursor: not-allowed;
}
.save {
  background-color: #4caf50;
}
.save:hover {
  background-color: #45a049;
}
.save:active {
  background-color: #3e8e41;
} */

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
  z-index: 5;
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
