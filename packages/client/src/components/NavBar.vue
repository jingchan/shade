<script setup lang="ts">
import { RouterLink } from 'vue-router';
import AuthFormModal from './AuthFormModal.vue';
import { ref } from 'vue';
import useAuthApi from '../clientApi/useAuthApi.ts';

defineProps<{
  links: { name: string; path: string }[];
}>();
const showAuth = ref(false);

const { loggedInUser, login, signup, logout } = useAuthApi();

async function handleLogin(username: string, password: string) {
  login(username, password);
}

async function handleSignup(username: string, email: string, password: string) {
  signup(username, email, password);
}
</script>

<template>
  <div class="nav">
    <RouterLink
      v-for="link in links"
      :key="link.name"
      class="nav-link"
      activeClass="active"
      :to="link.path"
      @dragstart.prevent
    >
      {{ link.name }}
    </RouterLink>
  </div>
  <div>
    <div v-if="loggedInUser">
      Logged in as {{ loggedInUser.username }}
      <button type="button" @click="logout">Logout</button>
    </div>
    <button v-else type="button" @click="showAuth = true">Login</button>
  </div>

  <Teleport to="body">
    <AuthFormModal
      v-if="showAuth"
      @close="showAuth = false"
      @login="handleLogin"
      @signup="handleSignup"
    />
  </Teleport>
</template>

<style scoped>
.nav {
  display: flex;
  justify-content: center;
  /* padding: 1em; */
  background-color: #f0f0f0;
  user-select: none;
}

.nav-link {
  min-width: 3rem;
  text-align: center;
  height: 100%;
  padding: 1rem;
}

@media (min-width: 800px) {
  .nav-link {
    min-width: 10rem;
  }
}

.nav-link:hover {
  background-color: #d0d0d0;
}
.nav-link + .active {
  background-color: #e0e0e0;
  font-weight: 600;
  box-shadow: inset 0 0 3px 0 rgba(0, 0, 0, 0.6);
}
</style>
