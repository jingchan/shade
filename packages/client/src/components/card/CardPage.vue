<script setup lang="ts">
import { onMounted, ref } from 'vue';

import { CardStack } from '../../cardStack.ts';
import { Card } from '../../card.ts';
import CardStackView from './CardStackView.vue';
import { useRoute } from 'vue-router';

const route = useRoute();

// const cards = ref(CardStack.example());
const cards = ref(new CardStack([]));

function addRandomCard() {
  cards.value.addCard(Card.random());
}
function removeCard() {
  const randomIndex = Math.floor(Math.random() * cards.value.length);
  cards.value.removeCard(randomIndex);
}

onMounted(() => {
  cards.value = new CardStack([Card.random(), Card.random()]);
});
</script>

<template>
  <div class="main">
    Hello {{ route.fullPath }}
    <button class="button" type="button" @click="addRandomCard">
      Add Card
    </button>
    <button class="button" type="button" @click="removeCard">
      Remove Card
    </button>
    <div class="tableau">
      <CardStackView :cards="cards" />
    </div>
  </div>
</template>

<style scoped>
.button {
  background-color: #4caf50;
  border: none;
  color: white;
  padding: 8px 10px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
  cursor: pointer;
}

.no-selection {
  user-select: none;
}

.tableau {
  height: 30%;
  background-color: #cce;
  position: relative;
  padding: 20px;
  /* perspective: 30em */
}
</style>
