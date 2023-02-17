<script setup lang="ts">
import { cardSets } from "@/services/card-set-storage";
import { useGetCardSets } from "@/composables/use-card-sets";

const { execute, isLoading, isReady } = useGetCardSets();
execute();
</script>

<template>
  <div class="flex-grow bg-neutral-100 p-4">
    <div v-if="isReady">
      <ul v-if="cardSets.length" class="grid gap-2">
        <li v-for="cardSet of cardSets" :key="cardSet.id">
          <RouterLink
            :to="{ name: 'set', params: { cardSetId: cardSet.id } }"
            class="block border rounded-2xl p-4 bg-white"
          >
            <h2>{{ cardSet.title }}</h2>
            <p class="text-xs opacity-50">Cards: {{ cardSet.cardsCount }}</p>
          </RouterLink>
        </li>
      </ul>
      <p v-else>Nothing...</p>
    </div>
    <p v-else-if="isLoading">Loading...</p>
  </div>
</template>
