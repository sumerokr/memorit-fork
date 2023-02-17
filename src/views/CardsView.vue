<script setup lang="ts">
import { ref } from "vue";
import { RouterLink } from "vue-router";
import type { Card } from "@/domain/card";
import type { CardSet } from "@/domain/card-set";
import { cardSetsRepository } from "@/services/card-sets-db-local-storage";
import { cardsRepository } from "@/services/cards-db-local-storage";

type Props = {
  cardSetId: string;
};

const props = defineProps<Props>();

const cardSet = ref<CardSet | null>(null);
cardSetsRepository.get(props.cardSetId).then((_cardSet) => {
  cardSet.value = _cardSet || null;
});

const cards = ref<Card[]>([]);
cardsRepository.getAll().then((_cards) => {
  cards.value = _cards.filter((card) => card.cardSetId === props.cardSetId);
});

const views = ["a", "b"];
const currentView = ref(views[0]);
// const switchView = () => {
//   const views = ["a", "b"];
//   const index = views.indexOf(currentView.value);
//   currentView.value = index === views.length - 1 ? views[0] : views[index + 1];
// };
</script>

<template>
  <div class="bg-neutral-100">
    <div class="p-4">
      <p class="mb-4">
        <RouterLink
          :to="{ name: 'set', params: { id: props.cardSetId } }"
          class="text-blue-500"
          ><span class="inline-block rotate-180">➜</span> Back to card
          set</RouterLink
        >
      </p>
      <h1 v-if="cardSet" class="text-2xl mb-4">{{ cardSet.title }}</h1>
      <p class="text-sm opacity-50">Cards: {{ cards.length }}</p>
    </div>

    <ul v-if="cards.length && currentView === 'a'" class="grid p-4 gap-2">
      <li
        v-for="card in cards"
        :key="card.id"
        class="grid border rounded-xl p-4 bg-white"
      >
        <span class="flex-1">{{ card.front }}</span>
        <hr class="my-2" />
        <span class="flex-1 opacity-50">{{ card.back }}</span>
      </li>
    </ul>

    <p v-else>No cards</p>
  </div>
</template>
