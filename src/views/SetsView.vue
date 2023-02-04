<script setup lang="ts">
import { ref, computed } from "vue";
import {
  useCreateCardSet,
  useDeleteCardSet,
  useGetCardSets,
  // useUpdateCardSet,
} from "@/composables/use-card-sets";
import { cardSets } from "@/services/card-set-storage";

const reversedCardSets = computed(() => cardSets.value.slice().reverse());

const {
  isReady: isGetCardSetsReady,
  isLoading: isGetCardSetsLoading,
  execute: getCardSets,
} = useGetCardSets();
getCardSets();

const { isLoading: isCreateCardSetLoading, execute: createCardSet } =
  useCreateCardSet();

const { execute: deleteCardSet, deletingIds } = useDeleteCardSet();

// const { execute: updateCardSet, updatingIds } = useUpdateCardSet();

const title = ref("");

const onSubmit = () => {
  createCardSet(title.value);
  title.value = "";
};
</script>

<template>
  <div>
    <form @submit.prevent="onSubmit">
      <input v-model="title" type="text" />
      <button type="submit" :disabled="isCreateCardSetLoading">add</button>
    </form>

    <template v-if="isGetCardSetsReady">
      <ul v-if="cardSets.length">
        <li v-for="cardSet of reversedCardSets" :key="cardSet.id">
          <RouterLink :to="{ name: 'set', params: { id: cardSet.id } }">
            <h2>{{ cardSet.title }}</h2>
            <p>
              <!-- <RouterLink :to="{ name: 'play', params: { id: cardSet.id } }"
              >+</RouterLink
            > -->
              <button
                @click="deleteCardSet(cardSet.id)"
                :disabled="deletingIds.includes(cardSet.id)"
              >
                ×
              </button>
            </p>
          </RouterLink>
        </li>
      </ul>
      <p v-else>Nothing</p>
    </template>
    <p v-else-if="isGetCardSetsLoading">Loading...</p>
    <p v-else>Error?</p>
  </div>
</template>

<style scoped></style>
