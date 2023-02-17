<script setup lang="ts">
import { ref } from "vue";
import { cardSetsRepository } from "@/services/card-sets-db-local-storage";
import type { CardSet } from "@/domain/card-set";

const cardSets = ref<CardSet[]>([]);
cardSetsRepository.getAll().then((_cardSets) => {
  cardSets.value = _cardSets;
});
</script>

<template>
  <div class="flex-grow bg-neutral-100 p-4">
    <ul v-if="cardSets.length" class="grid gap-2">
      <li v-for="cardSet of cardSets" :key="cardSet.id">
        <RouterLink
          :to="{ name: 'set', params: { cardSetId: cardSet.id } }"
          class="block border rounded-2xl p-4 bg-white"
        >
          <h2>{{ cardSet.title }}</h2>
        </RouterLink>
      </li>
    </ul>
    <p v-else>Loading...</p>
  </div>
</template>
