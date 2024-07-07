<script setup lang="ts">
import { ref } from 'vue';

import { useMouse } from '@vueuse/core';
import { Card, CardDef } from '../card';
import CardView from './CardView.vue';

enum TrackStates {
  NONE,
  DRAGGING,
};

const cards = ref([
  new Card(
    new CardDef(1, 'Card 1', 'Type 1', 'Attack 1'),
    { x: 0, y: 100 },
    false,
  ),
  new Card(
    new CardDef(1, 'Card 1', 'Type 1', 'Defend 1'),
    { x: 200, y: 300 },
    false,
  ),
  new Card(
    new CardDef(1, 'Card 1', 'Type 1', 'Steal 1'),
    { x: 300, y: 100 },
    false,
  ),
  new Card(
    new CardDef(1, 'Card 1', 'Type 1', 'Fire 1'),
    { x: 500, y: 200 },
    false,
  ),
  new Card(
    new CardDef(1, 'Card 1', 'Type 1', 'Ice 1'),
    { x: 700, y: 250 },
    false,
  ),
]);

const { x, y, sourceType } = useMouse();

/**
 * If mouse down but doesn't move, then it's a click, not a drag.  We can detect this
 * by tracking the mouse down and seeing if it moves before mouse up.  To make this
 * work well, we need to also make sure that before we consider it to be dragging, we
 * see if the mouse has moved a certain distance.
 */

function handleMouseDown(event: MouseEvent, card: Card) {
  // console.log('mousedown', event, card);
  const DRAG_THRESHOLD_RADIUS = 5;
  // const DRAG_THRESHOLD_DELAY_MS = 1000;

  let dragState = TrackStates.NONE;

  // if left click
  if (event.button === 0) {
    const startPosition = { x: card.position.x, y: card.position.y };
    const clickedAt = { x: event.clientX, y: event.clientY };
    // const clickedTime = Date.now();

    const moveHandler = (event: MouseEvent) => {
      if (dragState === TrackStates.NONE) {
        if (Math.sqrt((event.clientX - clickedAt.x) ** 2 + (event.clientY - clickedAt.y) ** 2) > DRAG_THRESHOLD_RADIUS) {
          dragState = TrackStates.DRAGGING;
        }
        // else if (Date.now() - clickedTime > DRAG_THRESHOLD_DELAY_MS) {
        //   dragState = TrackStates.DRAGG;
        // }
      }

      if (dragState === TrackStates.DRAGGING) {
        card.position.x = startPosition.x + event.clientX - clickedAt.x;
        card.position.y = startPosition.y + event.clientY - clickedAt.y;
      }
    };
    const upHandler = (_event: MouseEvent) => {
      if (dragState === TrackStates.NONE) {
        handleMouseClick(event, card);
      }
      window.removeEventListener('mousemove', moveHandler);
      window.removeEventListener('mouseup', upHandler);
    };

    window.addEventListener('mousemove', moveHandler);
    window.addEventListener('mouseup', upHandler);
  }
}

function disableAllCards() {
  cards.value.forEach((c) => {
    c.active = false;
  });
}

function handleMouseClick(event: MouseEvent, card: Card) {
  // console.log('handleMouseClick', event, card);
  // If left click
  if (event.button === 0) {
    disableAllCards();
    card.active = false;
    setTimeout(() => {
      card.active = true;
    }, 0);
  }
}
</script>

<template>
  <div class="main">
    Hello
    {{ x }} {{ y }} {{ sourceType }}
    <div class="tableau">
      awef
      <component
        :is="CardView"
        v-for="(card, i) in cards"
        :key="i"
        :card-def="card.cardDef"
        :active="card.active"
        :style="{
          position: 'absolute',
          left: `${card.position.x.toFixed(0)}px`,
          top: `${card.position.y.toFixed(0)}px`,
        }"
        @mousedown.prevent="handleMouseDown($event, card)"
      />
      <!-- <CardView
        v-for="(card, i) in cards"
        :key="i"
        :style="{
          position: 'absolute',
          left: `${Math.floor(card.position.x)}px`,
          // right: `${Math.floor(card.position.x)}px`,
          top: `${Math.floor(card.position.y)}px`,

        }"
        class="card"
        :card="card"
        @mousedown="handleMouseDown($event, card)"
        @click="handleMouseClick($event, card, $event.target)"
      /> -->
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
}
</style>
