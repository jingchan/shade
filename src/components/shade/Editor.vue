<script setup lang="ts">
import { inject, onMounted, Ref, ref, shallowRef, watch } from 'vue';
import '../../worker/userWorker';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import { ShaderCode } from '../../shader';
import { isIE } from '../../utils/browser';
import { removeQuickCommandFromContextMenu } from '../../utils/monaco';

const props = defineProps<{
  shader?: ShaderCode;
  content?: string;
}>();
const emit = defineEmits<{
  contentChanged: [code: string];
}>();

// Monaco pointers.
const monacoEl = ref<HTMLElement | null>();
const monacoEditor = shallowRef<monaco.editor.IStandaloneCodeEditor | null>(
  null,
);

// Resizing the editor when the layout changes.
const { splitRatio } = inject('splitRatio') as {
  splitRatio: Ref<number>;
};

watch(splitRatio, () => {
  monacoEditor.value?.layout();
});

removeQuickCommandFromContextMenu();
// const editorModel = ref<monaco.editor.ITextModel | null>(null);

onMounted(() => {
  if (monacoEl.value) {
    monacoEditor.value = monaco.editor.create(monacoEl.value, {
      value: props.shader?.userSource,
      language: 'wgsl',
      theme: 'vs-dark',
      lineNumbers: 'on' as monaco.editor.LineNumbersType,
      minimap: {
        enabled: false,
      },
      padding: {
        top: 24,
        bottom: 24 * 4,
      },
      scrollBeyondLastLine: false,
      // Keep Context Menu because right-click to copy/paste broken without it.
      // contextmenu: false,
      fontSize: 16,
    });

    const quickCommandKeys = isIE()
      ? monaco.KeyMod.Alt | monaco.KeyCode.F1
      : monaco.KeyCode.F1;
    monacoEditor.value.addCommand(quickCommandKeys, () => {});

    monacoEditor.value.onDidChangeModelContent(
      (_event: monaco.editor.IModelContentChangedEvent) => {
        emit('contentChanged', monacoEditor.value?.getValue() || '');
      },
    );
  }
});

window.addEventListener('resize', () => {
  monacoEditor.value?.layout();
});
</script>

<template>
  <div class="container">
    <div ref="monacoEl" class="monacoEl"></div>
  </div>
</template>

<style scoped>
.container {
  width: 100%;
  height: 100%;
  position: relative;
}
.monacoEl {
  position: absolute;
  width: 100%;
  height: 100%;
}
</style>
