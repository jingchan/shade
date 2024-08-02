<script setup lang="ts">
import { inject, onMounted, Ref, ref, watch } from 'vue';
import '../../worker/userWorker';
import { MonacoEditor } from '../../edit/monaco';

// TODO: take id
const props = withDefaults(
  defineProps<{
    editor: MonacoEditor;
    content: string;
  }>(),
  {
    content: '',
  },
);

const emit = defineEmits<{
  contentChanged: [code: string];
}>();

// Monaco pointers.
const monacoEl = ref<HTMLElement>();
// const monacoEditor = shallowRef<monaco.editor.IStandaloneCodeEditor>();

// Resizing the editor when the layout changes.
const { splitRatio } = inject('splitRatio') as {
  splitRatio: Ref<number>;
};

watch(splitRatio, () => {
  props.editor.layout();
});

// watchEffect(() => {
//   // console.log('propcontent watch effect fired', new Date());
//   // console.log(props.content.length);
//   monacoEditor.value?.setValue(props.content);
// });

function createEditor() {
  if (!monacoEl.value) {
    console.log('createEditor() called without a valid monacoEl');
    return;
  }

  props.editor.initWithElement(monacoEl.value, props.content);
  props.editor.onContentChange((newContent: string) => {
    console.log('content changed', newContent.length);
    emit('contentChanged', newContent);
  });
}

onMounted(() => {
  createEditor();
});

window.addEventListener('resize', () => {
  props.editor.layout();
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
