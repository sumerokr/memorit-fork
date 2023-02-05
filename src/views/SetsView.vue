<script setup lang="ts">
import { ref, computed } from "vue";
import {
  useCreateCardSet,
  useDeleteCardSet,
  useGetCardSets,
  // useUpdateCardSet,
} from "@/composables/use-card-sets";
import { cardSets } from "@/services/card-set-storage";
import type { CardSet } from "@/domain/card-set";

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

const onDelete = (id: CardSet["id"]) => {
  deleteCardSet(id);
};
</script>

<template>
  <div>
    <form @submit.prevent="onSubmit">
      <input v-model="title" type="text" />
      <button type="submit" :disabled="isCreateCardSetLoading">add</button>
    </form>

    <template v-if="isGetCardSetsReady">
      <ul v-if="cardSets.length" class="card-set-list">
        <li v-for="cardSet of reversedCardSets" :key="cardSet.id">
          <RouterLink
            :to="{ name: 'set', params: { id: cardSet.id } }"
            class="card-set"
          >
            <h2>{{ cardSet.title }}</h2>
            <p>
              <button
                @click="onDelete(cardSet.id)"
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

<style scoped>
.card-set-list {
  display: grid;
  gap: 1rem;
  padding-left: 0;
  list-style: none;
}

.card-set {
  display: block;
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 1rem;
  padding: 1rem;
  text-decoration: none;
  color: inherit;
}
</style>
