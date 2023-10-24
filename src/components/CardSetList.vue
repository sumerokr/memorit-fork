<script setup lang="ts">
import type { CardSet } from "@/domain/card-set";

type Props = {
  cardSets: Array<{
    cardSet: CardSet;
    cardsCount: number;
    cardsToStudyCount: number;
  }>;
};

defineProps<Props>();
</script>

<template>
  <ul class="grid gap-2">
    <li v-for="item of cardSets" :key="item.cardSet.id">
      <RouterLink
        :to="{ name: 'set', params: { cardSetId: item.cardSet.id } }"
        class="block border rounded-xl p-4 bg-white"
      >
        <h2 class="text-xl mb-2">{{ item.cardSet.title }}</h2>
        <p class="flex items-baseline justify-between opacity-60">
          <span>Cards: {{ item.cardsCount }}</span>
          <span
            >To study:
            <span
              class="inline-block -my-0.5 px-1 py-0.5 rounded-md"
              :class="item.cardsToStudyCount > 0 ? 'bg-amber-300' : 'bg-amber-100'"
              >{{ item.cardsToStudyCount }}</span
            ></span
          >
        </p>
      </RouterLink>
    </li>
  </ul>
</template>
