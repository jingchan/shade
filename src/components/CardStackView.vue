<script setup lang="ts">
import { useElementSize } from '@vueuse/core';
import { ref } from 'vue';
import type { CardStack } from '../cardStack';
import type { Card } from '../card';
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
const standardCardWidth = 170;
const standardCardHeight = 240;
const maxCardAngle = 10 * Math.PI / 180;
const cardAreaPadding = standardCardWidth * 0.8;
const cardMaxDistance = standardCardWidth * 0.87;

function cardPosition(cardIndex: number) {
  if (cardIndex < 0 || cardIndex >= props.cards.length) {
    throw new Error(`Card index out of bounds: ${cardIndex}`);
  }
  const numCards = props.cards.length;
  if (numCards <= 1) {
    return { x: width.value / 2, y: height.value / 2 };
  }

  // Radius of circle for card arc.
  const r = (width.value - cardAreaPadding * 2) / 2 / Math.tan(maxCardAngle);
  const maxCardAngleDelta = Math.atan2(cardMaxDistance, r);
  // const maxCardAngleDelta = 5 * Math.PI / 180;
  const cardAngleDelta = Math.min(maxCardAngleDelta, maxCardAngle * 2 / (numCards - 1));
  const cardAngleRange = cardAngleDelta * (numCards - 1);
  const cardAngleMin = -cardAngleRange / 2;
  // const cardAngleMax = cardAngleRange / 2;

  const theta = cardAngleMin + cardIndex * cardAngleDelta;
  const xPositionAdjustment = standardCardHeight / 2 * Math.sin(theta) - standardCardWidth / 2;
  const yPositionAdjustment = standardCardHeight / 2 * Math.cos(theta) - standardCardHeight / 2;
  const cardTopMidX = width.value / 2 + r * Math.sin(theta);
  // const cardTopMidY = height.value / 2 + r - r * Math.cos(theta);

  const yMaxDisplacement = r - r * Math.cos(cardAngleMin);
  const yDisplacementOffset = yMaxDisplacement / 2;
  const cardTopMidY = height.value / 2 - standardCardHeight / 2 - yDisplacementOffset + r - r * Math.cos(theta);
  const x = cardTopMidX + xPositionAdjustment;
  const y = cardTopMidY + yPositionAdjustment;
  // const x = cardTopMidX;
  // const y = cardTopMidY;

  // console.log('r', r, 'sinr', r * Math.sin(theta), 'cosr', r * Math.cos(theta));
  // console.log('card', props.cards.cards[cardIndex].name, 'x', x, 'y', y, 'theta', theta);

  // const cardSpacing = Math.min(standardCardWidth, width.value / numCards);
  // const cardAreaWidth = spacing * numCards;
  // const leftBound = (width.value - totalWidth) / 2;
  // const rightBound = leftBound + totalWidth;

  // const y = (height.value - standardCardHeight) / 2 + Y;
  return {
    x,
    y,
    angle: (theta * 180 / Math.PI).toFixed(5),
  };
}

function cardPositionStyle(cardIndex: number) {
  const position = cardPosition(cardIndex);
  return {
    left: `${(position.x).toFixed(5)}px`,
    top: `${(position.y).toFixed(5)}px`,
    transform: `rotate(${position.angle}deg)`,
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
