<script setup lang="ts">
import { cardSetsRepository } from "@/services/card-sets-db-local-storage";
import { cardsRepository } from "@/services/cards-db-local-storage";
import { ref, computed } from "vue";
import countBy from "lodash/countBy";
import { useAsyncState } from "@vueuse/core";
import { delay } from "@/utils/index";

const getCardSetsViewDataUC = async () => {
  const promises = Promise.all([
    cardSetsRepository.getAll(),
    cardsRepository.getAll(),
  ]);

  const [cardSets, cards] = await promises;

  const cardsCountByCardSetId = countBy(cards, "cardSetId");

  await delay();

  return cardSets.map(({ id, title }) => {
    return {
      id,
      title,
      cardsCount: cardsCountByCardSetId[id] ?? 0,
    };
  });
};

const {
  isLoading,
  error,
  state: cardSets,
} = useAsyncState(getCardSetsViewDataUC, null);

const reversedCardSets = computed(() => {
  return cardSets.value ? cardSets.value.slice().reverse() : null;
});

const title = ref("");

const onSubmit = async () => {
  if (!title.value.trim()) {
    return;
  }
  // await createCardSet(title.value);
  title.value = "";
};
</script>

<template>
  <div>
    <form @submit.prevent="onSubmit">
      <p>
        <label for="title">Card set name</label>
      </p>
      <p>
        <input v-model="title" id="title" type="text" />
        <button type="submit">Add</button>
      </p>
    </form>

    <div>
      <p v-if="isLoading">Loading...</p>
      <ul v-if="reversedCardSets?.length">
        <li v-for="cardSet of reversedCardSets" :key="cardSet.id">
          <h2>
            <RouterLink :to="{ name: 'set', params: { id: cardSet.id } }">{{
              cardSet.title
            }}</RouterLink>
          </h2>
          <p>Cards count: {{ cardSet.cardsCount }}</p>
        </li>
      </ul>
      <p v-else-if="reversedCardSets?.length === 0">Nothing</p>
      <p v-else-if="error">Error</p>
    </div>
  </div>
</template>
