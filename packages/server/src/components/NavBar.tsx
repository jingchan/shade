import DiscordButton from './buttons/discord';
import GitHubButton from './buttons/github';
import ToggleDarkButton from './buttons/ToggleDarkButton';
import TwitterButton from './buttons/twitter';
import YoutubeButton from './buttons/youtube';
import SearchBar from './SearchBar';
import NavAuthWidget from './NavAuthWidget';

const links = [
  { name: 'Main', path: '/' },
  { name: 'Card', path: '/card' },
  { name: 'Demos', path: '/demos' },
  { name: 'Shaders', path: '/shade' },
];

export default async function NavBar() {
  return (
    <div
      className={
        'flex items-center justify-between w-full px-3 py-3 mx-auto max-w-8xl lg:px-4'
      }
    >
      <div className="flex items-center">
        <a
          className="underline hover:text-black dark:hover:text-gray-200"
          href="/"
        >
          Shadrs.com
        </a>
      </div>
      <SearchBar />
      <div className="flex items-center">
        <ul className="flex-col hidden pt-6 lg:flex-row lg:self-center lg:py-0 lg:flex">
          {links.map((link) => (
            <li key={link.name} className="mb-3 lg:px-2 xl:px-2 lg:mb-0">
              <a
                href={link.path}
                className="text-sm font-medium text-gray-900 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-500"
              >
                {link.name}
              </a>
            </li>
          ))}
        </ul>
        <GitHubButton href="" />
        <DiscordButton href="" />
        <YoutubeButton href="" />
        <TwitterButton href="" />
        <ToggleDarkButton />
        <NavAuthWidget />
      </div>
    </div>
  );
}

{
  /* <script setup lang="ts">
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
</style> */
}
