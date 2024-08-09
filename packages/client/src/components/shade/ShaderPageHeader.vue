<script setup lang="ts">
import { ref, watchEffect } from 'vue';
import { Project } from 'shade-common';

const props = defineProps<{
  project?: Project;
}>();
const emit = defineEmits<{
  nameChanged: [newName: string];
}>();
const nameEl = ref<HTMLElement>();
const nameModel = ref<string>();

watchEffect(() => {
  resetName();
});

function resetName() {
  nameModel.value = props.project?.name;
}

function updateName() {
  if (nameModel?.value) {
    emit('nameChanged', nameModel.value);
  } else {
    resetName();
  }
}

function handleKeyPress(event: KeyboardEvent) {
  switch (event.code) {
    case 'Enter':
      nameEl.value?.blur();
      break;
    case 'Space':
      break;
  }
}

function handleFocusOut(_event: Event) {
  updateName();
}
</script>

<template>
  <div class="header">
    <input
      ref="nameEl"
      v-model="nameModel"
      type="text"
      class="edit"
      @keypress="handleKeyPress"
      @focusout="handleFocusOut"
    />
    <!-- <div v-else @click="handleNameClicked">{{ project?.name }}</div> -->
  </div>
</template>

<style scoped>
.header {
  font-size: 1.4rem;
  padding: 0.4rem 1rem;
  display: flex;
  align-items: center;
  justify-items: center;
  background-color: white;
}
.edit {
  background-color: rgba(1, 1, 1, 0);
  font-size: 1.4rem;
  text-decoration: underline #000 dotted 0.08em;
  cursor: pointer;
}
.edit:focus {
  text-decoration: none;
  cursor: text;
}
</style>
