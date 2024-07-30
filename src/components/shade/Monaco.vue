<script setup lang="ts">
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import { onMounted, ref } from 'vue';
const monedit = ref<HTMLElement | null>();

onMounted(() => {
  if (monedit.value) {
    console.log('mounting');
    monaco.editor.create(monedit.value, {
      value: ['function x() {', '\tconsole.log("Hello world!");', '}'].join(
        '\n',
      ),
      language: 'typescript',
      theme: 'vs-dark',
    });
  }
});
</script>

<template>
  <div class="editor">
    <div ref="monedit" class="monedit"></div>
  </div>
</template>

<style scoped>
.editor {
  /* background: green; */
  width: 100vw;
  height: 100vh;
  /* padding: 0.5rem 0.9rem; */
}

.monedit {
  position: absolute;
  width: 100vw;
  height: 100vh;
}
</style>
