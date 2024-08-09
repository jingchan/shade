<script setup lang="ts">
import { ref } from 'vue';

// import { RouterLink } from 'vue-router';
const emit = defineEmits<{
  login: [username: string, password: string];
  signup: [username: string, email: string, password: string];
  close: [];
}>();

const showLoginTab = ref(true);
const username = ref('');
const email = ref('');
const password = ref('');
</script>

<template>
  <div class="background" @click="emit('close')">
    <div class="modal" @click.stop>
      <div class="tabs">
        <div
          class="tab"
          :class="{
            active: showLoginTab,
          }"
          @click="() => (showLoginTab = true)"
        >
          Login
        </div>
        <div
          class="tab"
          :class="{
            active: !showLoginTab,
          }"
          @click="() => (showLoginTab = false)"
        >
          Sign Up
        </div>
      </div>
      <div v-if="showLoginTab">
        <form
          class="form-container"
          @submit.prevent="emit('login', username, password)"
        >
          <label for="username">Username or Email:</label>
          <input
            v-model="username"
            type="text"
            placeholder="Username"
            required
          />
          <label for="password">Password:</label>
          <input
            v-model="password"
            type="password"
            placeholder="Password"
            required
          />
          <button type="submit">Login</button>
        </form>
      </div>
      <div v-else>
        <form
          class="form-container"
          @submit.prevent="emit('signup', username, email, password)"
        >
          <label for="username">Username:</label>
          <input
            v-model="username"
            type="text"
            placeholder="Username"
            required
          />
          <label for="email">Email:</label>
          <input v-model="email" type="text" placeholder="Email" required />
          <label for="password">Password:</label>
          <input
            v-model="password"
            type="password"
            placeholder="Password"
            required
          />
          <button type="submit">> Sign Up</button>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal {
  background-color: white;
  padding: 2rem;
  border-radius: 0.8rem;
  box-shadow: 4px 4px 16px 0 rgba(0, 0, 0, 0.6);
}
.modal .tabs {
  display: flex;
  justify-content: center;
  font-size: 1rem;
}
.modal .tab {
  width: 8rem;
  text-align: center;
  color: rgba(0, 0, 0, 0.5);
  cursor: pointer;
}
.modal .tab.active {
  color: #000;
  border-bottom: solid 2px #000;
}
.modal .form-container {
  display: flex;
  flex-direction: column;
  padding: 1rem 2rem;
}
.modal input {
  font-size: inherit;
  border: solid 1px black;
  margin-bottom: 0.5rem;
}
.modal button {
  display: block;
  border: solid 4px rgb(111, 146, 251);
  background-color: rgb(179, 198, 255);
  padding: 0.4rem;
  border-radius: 8px;
  margin-top: 1rem;
}
.background {
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  top: 0;
  z-index: 10;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
}
</style>
