<script setup lang="ts">
import { ref } from 'vue';
import type { CardDef } from '../card';

const _props = defineProps<{
  cardDef: CardDef;
  active?: boolean;
}>();

const theme = ref({
  borderRadius: 10,
  cardBackgroundColor: 'hsla(220, 52%, 90%, 1.0)',
  cardBorderColor: 'rgba(188, 188, 188, 1.0)',
  cardBorderWidth: 3,

  edgeColor: 'rgba(55, 55, 55, 0.4)',
  shadowColor: 'rgba(0, 0, 0, 0.24)',

  cardHighlightColor: 'rgba(255, 252, 87, 0.6)',
  cardHighlightBorderColor: 'rgba(251, 249, 139, 1.0)',
  cardHighlightBorderWidth: 5,

  cardHighlightGlowGap: 4,
  cardHighlightGlowColor: 'rgb(164, 255, 36, 0.7)',
  cardHighlightGlowWidth: 2,
  cardHighlightGlowSpread: 4,
  cardHighlightGlowInnerColor: 'rgb(243, 255, 235)',
  cardHighlightGlowInnerWidth: 1,
});
</script>

<template>
  <div
    class="card"
    :class="{
      highlighted: active,
    }"
  >
    <div class="title">
      {{ cardDef.name }}
    </div>
    <div class="image" />
    <div class="type">
      {{ cardDef.type }}
    </div>
    <div class="description">
      {{ cardDef.description }}
    </div>
  </div>
</template>

<style scoped>
.card {
  width: 170px;
  height: 240px;
  /* border: solid 2px black; */
  /* border-radius: 8px; */
  box-sizing: border-box;
  background-color: v-bind('`${theme.cardBackgroundColor}`');
  padding: 2px 4px 4px 4px;
  border-radius: v-bind('`${theme.borderRadius}px`');
  @apply no-selection;
  font-size: small;
  display: flex;
  flex-direction: column;
}
.title {
  display: flex;
  justify-content: center;
  align-items: end;
  font-weight: bold;
}
.image {
  background-color: rgba(35, 31, 31, 0.1);
  height: 130px;
  border-radius: 2px;
}
.type {
  font-style: italic;
  background-color: rgba(255, 255, 255, 0.7);
  /* margin-bottom: 2px; */
  margin: 1px 0;
  border-radius: 2px;
  /* border: solid 1px rgba(0, 0, 0, 0.1); */
  box-sizing: border-box;
  font-size: x-small;
}
.description {
  background-color: rgba(255, 255, 255, 0.5);
  flex: 1;
  border-radius: 2px 2px 8px 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.card:after {
  @apply full-sized-pseudo;
  /* border: solid 1px rgba(224, 224, 224, 0.9); */
  box-shadow: inset 0 0 0 0.4px rgba(255, 255, 255, 0.9), 2px 2px 10px 0 rgba(0, 0, 0, 0.24);
  box-shadow: v-bind('`inset 0 0 0 0.2px ${theme.edgeColor}, 2px 2px 10px 0 ${theme.shadowColor}`');
  border-radius: v-bind('`${theme.borderRadius}px`');
  /* border-inline: solid 10px black; */
}

.full-sized-pseudo {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

/* .card::before {
  @apply full-sized-pseudo;
  border: solid var(--card-border-width) var(--card-border-color);
  border-radius: 10px;
} */
/* highlight animation */
.card.highlighted {
}

.card.highlighted::before {
  @apply full-sized-pseudo;
  border-radius: 10px;
  top: v-bind('`${-(theme.cardHighlightGlowGap)}px`');
  left: v-bind('`${-(theme.cardHighlightGlowGap)}px`');
  width: v-bind('`calc(100% + ${2 * theme.cardHighlightGlowGap}px)`');
  height: v-bind('`calc(100% + ${2 * theme.cardHighlightGlowGap}px)`');
  border-radius: v-bind('`${theme.borderRadius + theme.cardHighlightGlowGap}px`');

  /* Style 1 */
  /* box-shadow: 2px 2px 0 5px rgb(31, 236, 147), -2px -2px 0 5px rgb(255, 195, 54); */

  /* Style 2 */
  /* box-shadow: inset 0 0 8px 2px rgb(167, 255, 44, 0.7), 0 0 0 8px rgb(243, 255, 235), 0 0 8px 11px rgb(164, 255, 36, 0.7); */
  box-shadow: inset 0 0 8px 2px rgb(164, 255, 36, 0.7), 0 0 0 2px rgb(243, 255, 235), 0 0 8px 4px rgb(164, 255, 36, 0.7);
  --glow-color: v-bind('`${theme.cardHighlightGlowColor}`');
  --in-glow-shadow: v-bind('`inset 0 0 ${theme.cardHighlightGlowSpread}px ${theme.cardHighlightGlowWidth}px ${theme.cardHighlightGlowColor}`');
  --mid-glow-shadow: v-bind('`0 0 0 ${theme.cardHighlightGlowInnerWidth}px ${theme.cardHighlightGlowInnerColor}`');
  --out-glow-shadow: v-bind('`0 0 ${theme.cardHighlightGlowSpread}px ${theme.cardHighlightGlowInnerWidth + theme.cardHighlightGlowWidth}px ${theme.cardHighlightGlowColor}`');
  box-shadow: var(--in-glow-shadow), var(--mid-glow-shadow), var(--out-glow-shadow);
}

.card.highlighted::after {
  @apply full-sized-pseudo;
  border-radius: 10px;
  /* border: solid 6px red; */
  /* background-color: red; */
  animation: highlight 0.5s normal;
  animation-timing-function: ease-out;
}

@keyframes highlight {
  10% {
    background-color: v-bind('theme.cardHighlightColor')
  }
  /* 100% {
    background-color: rgba(130, 100, 180, 0.8);
  } */
}

/* .card:hover {
  background-color: rgba(30, 0, 80, 0.8);
}
.card:active {
  background-color: rgba(30, 100, 180, 0.8);
} */

.no-selection {
  user-select: none;
}
</style>
