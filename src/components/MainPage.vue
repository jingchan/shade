<script setup lang="ts">
import { onMounted, ref } from 'vue';

import { CardStack } from '../cardStack.ts';
import { Card } from '../card.ts';
import CardStackView from './CardStackView.vue';

// const cards = ref(CardStack.example());
const cards = ref(new CardStack([]));

function addRandomCard() {
  cards.value.addCard(Card.random());
}

onMounted(() => {
  cards.value = new CardStack([
    Card.random(),
    Card.random(),
  ]);
});
</script>

<template>
  <div class="main">
    Hello
    <button
      @click="addRandomCard"
    >
      Add Card
    </button>
    <div class="tableau">
      awef
      <CardStackView :cards="cards" />
    </div>
  </div>
</template>

<style scoped>
.main {
  height: 100%;
}

/* .card {
  background-color: rgba(130, 200, 180, 0.8);
  @apply no-selection;
} */
/* .card:hover {
  background-color: rgba(30, 200, 80, 0.8);
}
.card:active {
  background-color: rgba(30, 100, 180, 0.8);
} */

.no-selection {
  user-select: none;
}

.tableau {
  width: 80%;
  height: 30%;
  background-color: #4dd;
  position: relative;
  padding: 20px;
  /* perspective: 30em */
}
</style>
