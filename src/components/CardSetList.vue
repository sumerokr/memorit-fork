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
        <p class="flex items-baseline justify-between text-xs opacity-60">
          <span>Cards: {{ cardSet.cardsCount }}</span>
          <span
            >To study:
            <span
              class="inline-block px-1 py-0.5 rounded-md"
              :class="
                cardSet.cardsToStudyCount > 0 ? 'bg-amber-300' : 'bg-amber-100'
              "
              >{{ cardSet.cardsToStudyCount }}</span
            ></span
          >
        </p>
      </RouterLink>
    </li>
  </ul>
</template>
