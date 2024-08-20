<script setup lang="ts">
import { ref, watch } from 'vue';
import { ProjectData } from 'shade-common';

const props = defineProps<{
  project?: ProjectData;
}>();
const emit = defineEmits<{
  nameChanged: [newName: string];
}>();
const formEl = ref<HTMLFormElement>();
const nameEl = ref<HTMLInputElement>();
const editedNameModel = ref<string>();

watch(
  () => props.project,
  () => {
    resetName();
  },
  { immediate: true },
);

function resetName() {
  editedNameModel.value = props.project?.name;
}

function doNameChange() {
  if (editedNameModel.value !== props.project?.name) {
    emit('nameChanged', editedNameModel.value);
  }
}

function handleFocusOut(_event: FocusEvent) {
  doNameChange();
}

function handleSubmit(event?: Event) {
  event.preventDefault();

  // Note that calling blur() triggers the emitting the nameChange event.  We
  // call blur() directly to obtain the desired UI outcome and avoid double-calling
  // the event.
  // doNameChange();
  nameEl.value.blur();
}
</script>

<template>
  <form ref="formEl" class="bg-white" @submit="handleSubmit">
    <input
      ref="nameEl"
      v-model="editedNameModel"
      type="text"
      class="edittext mx-2 my-1"
      @focusout="handleFocusOut"
    />
  </form>
</template>

<style scoped></style>

<!-- @focusin="handleFocusOut" -->
