<script setup lang="ts">
import { useElementSize } from '@vueuse/core';
import { ref } from 'vue';
import type { CardStack } from '../cardStack';
import type { Card } from '../card';
import type { PositioningInfo } from '../positioning';
import { calculateArcPositions } from '../positioning';
import { Angle, Size } from '../types';
import CardView from './CardView.vue';

const props = defineProps<{
  cards: CardStack;
}>();

const DRAG_THRESHOLD_RADIUS = 5;
// const DRAG_THRESHOLD_DELAY_MS = 1000;

enum TrackStates {
  NONE,
  DRAGGING,
};

/**
 * If mouse down but doesn't move, then it's a click, not a drag.  We can detect this
 * by tracking the mouse down and seeing if it moves before mouse up.  To make this
 * work well, we need to also make sure that before we consider it to be dragging, we
 * see if the mouse has moved a certain distance.
 */
function handleMouseDown(event: MouseEvent, card: Card) {
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

function handleMouseClick(event: MouseEvent, card: Card) {
  // console.log('handleMouseClick', event, card);
  // If left click
  if (event.button === 0) {
    props.cards.deselectAllCards();
    // To restart any active CSS animations, we have to ensure that the class is
    // removed before adding the class that triggers the activation animation.
    setTimeout(() => {
      props.cards.selectCard(card);
    }, 0);
    props.cards.flipCard(card);
  }
}

const rootEl = ref(null);
const { width, height } = useElementSize(rootEl);

function cardPosition(cardIndex: number): PositioningInfo {
  const positions = calculateArcPositions(props.cards, new Size(width.value, height.value));
  return positions[cardIndex];
}

function cardPositionStyle(cardIndex: number) {
  const card = props.cards.cards[cardIndex];
  const cardHalfSize = card.size.halfsize();
  const { center, rotation = Angle.ZERO } = cardPosition(cardIndex);
  const topLeft = center.sub(cardHalfSize);

  return {
    left: `${(topLeft.x).toFixed(5)}px`,
    top: `${(topLeft.y).toFixed(5)}px`,
    transform: `rotate(${rotation.degrees}deg)`,
  };
}
</script>

<template>
  <div
    ref="rootEl"
    class="stack-container"
    :class="{
      // highlighted: active,
    }"
  >
    <CardView
      v-for="(card, cardIndex) in cards"
      :key="cardIndex"
      :name="card.name"
      :type="card.type"
      :description="card.description"
      :active="card.active"
      :is-face-down="card.isFaceDown"
      :style="{
        position: 'absolute',
        // left: `${card.position.x.toFixed(0)}px`,
        // top: `${card.position.y.toFixed(0)}px`,
        ...cardPositionStyle(cardIndex),
      }"
      @mousedown.prevent="handleMouseDown($event, card)"
    />
  </div>
</template>

<style scoped>
.stack-container {
  background-color: red;
  margin: auto;
  width: 50%;
  height : 300px;
  position: relative;
}
</style>
