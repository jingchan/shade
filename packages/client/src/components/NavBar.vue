<script setup lang="ts">
import { RouterLink } from 'vue-router';
import SearchBar from './SearchBar.vue';

defineProps<{
  links: { name: string; path: string }[];
}>();
</script>

<template>
  <div
    class="flex items-center justify-between w-full px-3 py-3 mx-auto max-w-8xl lg:px-4"
  >
    <div class="flex items-center">
      <a class="underline hover:text-black dark:hover:text-gray-200" href="/">
        Shadrs.com
      </a>
    </div>
    <SearchBar />

    <div class="flex items-center">
      <ul
        class="flex-col hidden pt-6 lg:flex-row lg:self-center lg:py-0 lg:flex"
      >
        <li
          v-for="link in links"
          :key="link.name"
          class="mb-3 lg:px-2 xl:px-2 lg:mb-0"
        >
          <RouterLink
            class="text-sm font-medium text-gray-900 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-500"
            activeClass="active"
            :to="link.path"
            @dragstart.prevent
          >
            {{ link.name }}
          </RouterLink>
        </li>
      </ul>
      <!-- <GitHubButton href="" />
      <DiscordButton href="" />
      <YoutubeButton href="" />
      <TwitterButton href="" />
      <ToggleDarkButton />
      <NavAuthWidget /> -->
    </div>
  </div>

  <!-- <div>
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
  </Teleport> -->
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
