<script setup lang="ts">
import type { CardSet } from "@/domain/card-set";

type Props = {
  cardSets: CardSet[] | Readonly<CardSet[]>;
};

defineProps<Props>();
</script>

<template>
  <ul v-if="cardSets.length" class="grid gap-2">
    <li v-for="cardSet of cardSets" :key="cardSet.id">
      <RouterLink
        :to="{ name: 'set', params: { cardSetId: cardSet.id } }"
        class="block border rounded-xl p-4 bg-white"
      >
        <h2>{{ cardSet.title }}</h2>
        <p class="text-xs opacity-60">Cards: {{ cardSet.cardsCount }}</p>
      </RouterLink>
    </li>
  </ul>
</template>
