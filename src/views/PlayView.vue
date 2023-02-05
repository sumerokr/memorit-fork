<script setup lang="ts">
import { ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import type { Card } from "@/domain/card";
import { useChangeCardStatus } from "@/composables/use-cards";
import { useGetCardsByCardSetId } from "@/composables/use-cards";
import { cardsByCardSetId } from "@/services/cards-storage";

const route = useRoute();
const cardSetId = route.params.id as string;

const isFlipped = ref(false);

const {
  isReady: isGetCardsReady,
  isLoading: isGetCardsLoading,
  execute: getCards,
} = useGetCardsByCardSetId();
getCards(cardSetId);

const cards = computed(() => {
  return (
    cardsByCardSetId.value[cardSetId]
      // .filter((card) => card.showAfter < new Date().toISOString())
      .filter((card) => card.showAfter < "2024-02-05T21:02:39.643Z")
      .sort((cardA, cardB) => {
        return (
          new Date(cardA.showAfter).getTime() -
          new Date(cardB.showAfter).getTime()
        );
      })
      .slice(0, 5)
  );
});
const step = ref(1);
const card = computed(() => {
  return cards.value[step.value - 1];
});

const { isLoading: isChangeCardStatusLoading, execute: changeCardStatus } =
  useChangeCardStatus();

const onFlip = () => {
  isFlipped.value = !isFlipped.value;
};

const onBad = async () => {
  const progress = Math.max(card.value.progress - 2, 1);
  // @ts-ignore
  await changeCardStatus({ id: card.value.id, progress });
  step.value++;
  isFlipped.value = false;
};
const onOk = async () => {
  const progress = card.value.progress;
  // @ts-ignore
  await changeCardStatus({ id: card.value.id, progress });
  step.value++;
  isFlipped.value = false;
};
const onGood = async () => {
  const progress = Math.min(card.value.progress + 1, 10);
  // @ts-ignore
  await changeCardStatus({ id: card.value.id, progress });
  step.value++;
  isFlipped.value = false;
};
</script>

<template>
  <div class="container">
    <template v-if="isGetCardsReady">
      <div v-if="cards.length">
        <p>{{ step }} / {{ cards.length }}</p>
        <hr />
        <div class="scene">
          <div
            class="card"
            :class="{ 'is-flipped': isFlipped }"
            @click="onFlip"
          >
            <div class="face front">{{ card.front }}</div>
            <div class="face back">{{ card.back }}</div>
          </div>
        </div>
        <hr />
        <p class="actions">
          <button
            :disabled="isChangeCardStatusLoading"
            type="button"
            @click="onBad"
          >
            Bad
          </button>
          <button
            :disabled="isChangeCardStatusLoading"
            type="button"
            @click="onOk"
          >
            Ok
          </button>
          <button
            :disabled="isChangeCardStatusLoading"
            type="button"
            @click="onGood"
          >
            Good
          </button>
        </p>
      </div>
      <div v-else-if="cards.length === 0">Nothing</div>
    </template>
    <div v-else-if="isGetCardsLoading">Loading...</div>
    <div v-else>Error...</div>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  height: 85vh;
  flex-direction: column;
}

.scene {
  height: 260px;
  perspective: 700px;
}

.card {
  width: 100%;
  height: 100%;
  position: relative;
  /* transition: transform 0.5s; */
  transform-style: preserve-3d;
  will-change: transform;
}

.face {
  position: absolute;
  inset: 0;
  backface-visibility: hidden;
  display: grid;
  place-items: center;
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 1rem;
  padding: 1rem;
  font-size: 3rem;
}

.front {
  background: #fff;
}

.back {
  background: #fff;
  transform: rotateY(180deg);
}

.card.is-flipped {
  transition: transform 0.5s;
  transform: rotateY(-180deg);
}

.actions {
  margin-top: auto;
  display: flex;
  justify-content: space-between;
  gap: 1rem;
}

.actions > button {
  flex-grow: 1;
}
</style>
