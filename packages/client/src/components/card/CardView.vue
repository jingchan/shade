<script setup lang="ts">
import { reactive, ref, watch } from 'vue';
import gsap from 'gsap';

const props = defineProps<{
  name: string;
  type: string;
  description: string;
  image: string;
  active?: boolean;
  isFaceDown?: boolean;
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

const motion = reactive({
  flipDegrees: 0,
  backVisible: false,
});

// TODO: Need to tweak animation.
const FLIP_ANIMATION_DURATION_SECS = 0.2;
watch(
  () => props.isFaceDown,
  (newValue, oldValue) => {
    if (newValue !== oldValue) {
      if (newValue) {
        const tl = gsap.timeline();
        tl.to(motion, {
          flipDegrees: 90,
          duration: FLIP_ANIMATION_DURATION_SECS / 2,
          // ease: 'easeInSine',
          onComplete: () => {
            motion.backVisible = true;
          },
        });
        tl.to(motion, {
          flipDegrees: 180,
          duration: FLIP_ANIMATION_DURATION_SECS / 2,
          // ease: 'easeOutSine',
        });
      } else {
        const tl = gsap.timeline();
        tl.to(motion, {
          flipDegrees: 90,
          duration: FLIP_ANIMATION_DURATION_SECS / 2,
          ease: 'easeInSine',
          onComplete: () => {
            motion.backVisible = false;
          },
        });
        tl.to(motion, {
          flipDegrees: 0,
          duration: FLIP_ANIMATION_DURATION_SECS / 2,
          ease: 'easeOutSine',
        });
      }
    }
  },
);
</script>

<template>
  <div class="card-container">
    <div
      class="card"
      :style="{
        transform: `rotate3d(0, 1, 0, ${motion.flipDegrees.toFixed(0)}deg)`,
      }"
    >
      <div v-if="active" class="card-highlight" />
      <div v-if="active" class="card-highlight-ring" />
      <div class="card-content">
        <div v-if="motion.backVisible" class="card-back" />
        <div class="card-front">
          <div class="title">
            {{ name }}
          </div>
          <div class="image" :style="{ backgroundImage: `url('${image}')` }" />
          <div class="type">
            {{ type }}
          </div>
          <div class="description">
            {{ description }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card {
  width: 170px;
  height: 240px;
  /* width: 170px;
  height: 5px; */
}

.card-content {
  border-radius: v-bind('`${theme.borderRadius}px`');
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
  @apply no-selection;
}

/* Card drop shadow. */
.card:after {
  @apply full-sized-pseudo;
  /* border: solid 1px rgba(224, 224, 224, 0.9); */
  box-shadow:
    inset 0 0 0 0.4px rgba(255, 255, 255, 0.9),
    2px 2px 10px 0 rgba(0, 0, 0, 0.24);
  box-shadow: v-bind(
    '`inset 0 0 0 0.2px ${theme.edgeColor}, 2px 2px 10px 0 ${theme.shadowColor}`'
  );
  border-radius: v-bind('`${theme.borderRadius}px`');
  /* border-inline: solid 10px black; */
}

/* Card hover styling. */
.card-container:hover {
  /* Bring to front. */
  z-index: 1;
}
.card-container:hover .card::after {
  /* define variable for color */
  --hover-color: rgba(255, 167, 3, 0.358);

  @apply full-sized-pseudo;
  box-shadow: 0 0 0 2px var(--hover-color);
  background-color: var(--hover-color);
}

/**
  * Add highlight ring.
  */
.card-highlight-ring {
  @apply full-sized;
  position: absolute;

  border-radius: 10px;
  top: v-bind('`${-(theme.cardHighlightGlowGap)}px`');
  left: v-bind('`${-(theme.cardHighlightGlowGap)}px`');
  width: v-bind('`calc(100% + ${2 * theme.cardHighlightGlowGap}px)`');
  height: v-bind('`calc(100% + ${2 * theme.cardHighlightGlowGap}px)`');
  border-radius: v-bind(
    '`${theme.borderRadius + theme.cardHighlightGlowGap}px`'
  );

  /* Style 1 - 2 Color Ring */
  /* box-shadow: 2px 2px 0 5px rgb(31, 236, 147, 0.7), -2px -2px 0 5px rgb(255, 195, 54, 0.7); */

  /* Style 2 - Green Glow */
  box-shadow:
    inset 0 0 8px 2px rgb(164, 255, 36, 0.7),
    0 0 0 2px rgb(243, 255, 235),
    0 0 8px 4px rgb(164, 255, 36, 0.7);
  --glow-color: v-bind('`${theme.cardHighlightGlowColor}`');
  --in-glow-shadow: v-bind(
    '`inset 0 0 ${theme.cardHighlightGlowSpread}px ${theme.cardHighlightGlowWidth}px ${theme.cardHighlightGlowColor}`'
  );
  --mid-glow-shadow: v-bind(
    '`0 0 0 ${theme.cardHighlightGlowInnerWidth}px ${theme.cardHighlightGlowInnerColor}`'
  );
  --out-glow-shadow: v-bind(
    '`0 0 ${theme.cardHighlightGlowSpread}px ${theme.cardHighlightGlowInnerWidth + theme.cardHighlightGlowWidth}px ${theme.cardHighlightGlowColor}`'
  );
  box-shadow: var(--in-glow-shadow), var(--mid-glow-shadow),
    var(--out-glow-shadow);
}

.card-highlight {
  @apply full-sized;
  position: absolute;
  border-radius: 10px;

  animation: highlight 0.5s normal;
  animation-timing-function: ease-out;
}

@keyframes highlight {
  10% {
    background-color: v-bind('theme.cardHighlightColor');
  }
}

.card-front {
  background-color: v-bind('`${theme.cardBackgroundColor}`');
  padding: 2px 4px 4px 4px;
  font-size: small;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
}

.card-front .title {
  display: flex;
  /* justify-content: center; */
  justify-content: start;
  margin-left: 2px;
  align-items: end;
  font-weight: bold;
}

.card-front .image {
  background-color: rgba(35, 31, 31, 0.1);
  height: 130px;
  border-radius: 2px;
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
}

.card-front .type {
  font-style: italic;
  background-color: rgba(255, 255, 255, 0.7);
  /* margin-bottom: 2px; */
  margin: 1px 0;
  border-radius: 2px;
  /* border: solid 1px rgba(0, 0, 0, 0.1); */
  box-sizing: border-box;
  font-size: x-small;
}

.card-front .description {
  background-color: rgba(255, 255, 255, 0.5);
  flex: 1;
  border-radius: 2px 2px 8px 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.card-back {
  @apply full-sized;
  position: absolute;

  /* Starts off backwards (but not visible). */
  transform: rotate(180deg);

  /* Placeholder card back pattern. */
  --s: 20px; /* control the size*/
  --c1: #8c2318;
  --c2: #f2c45a;
  background:
    conic-gradient(at 60% 60%, var(--c1) 75%, #0000 0) 0 0 /
      calc(5 * var(--s) / 2) calc(5 * var(--s) / 2),
    repeating-conic-gradient(var(--c1) 0 25%, #0000 0 50%) 0 0 /
      calc(5 * var(--s)) calc(5 * var(--s)),
    repeating-conic-gradient(var(--c2) 0 25%, var(--c1) 0 50%) 0 0 / var(--s)
      var(--s);
}

/* TODO: Move these to a more global section. */
.no-selection {
  user-select: none;
}
.full-sized {
  width: 100%;
  height: 100%;
}
.full-sized-pseudo {
  @apply full-sized;
  content: '';
  position: absolute;
  top: 0;
  left: 0;
}
</style>
