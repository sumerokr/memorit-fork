<script setup lang="ts">
import { ref, computed } from "vue";
import { useCreateCardSet, useGetCardSets } from "@/composables/use-card-sets";
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

const title = ref("");

const onSubmit = async () => {
  if (!title.value.trim()) {
    return;
  }
  await createCardSet(title.value);
  title.value = "";
};
</script>

<template>
  <div>
    <form class="form" @submit.prevent="onSubmit">
      <p style="margin-bottom: 0.5rem">
        <label for="title">Card set name</label>
      </p>
      <p style="margin-top: 0.5rem">
        <input v-model="title" id="title" class="input" type="text" />
        <button class="button" type="submit" :disabled="isCreateCardSetLoading">
          Add
        </button>
      </p>
    </form>

    <template v-if="isGetCardSetsReady">
      <TransitionGroup
        v-if="cardSets.length"
        class="card-set-list"
        name="list"
        tag="ul"
      >
        <li v-for="cardSet of reversedCardSets" :key="cardSet.id">
          <RouterLink
            :to="{ name: 'set', params: { id: cardSet.id } }"
            class="card-set"
          >
            <h2>{{ cardSet.title }}</h2>
          </RouterLink>
        </li>
      </TransitionGroup>

      <p v-else>Nothing</p>
    </template>
    <p v-else-if="isGetCardSetsLoading">Loading...</p>
    <p v-else>Error?</p>
  </div>
</template>

<style scoped>
.form {
  border-bottom: 1px solid gray;
  padding: 1rem;
  background-color: #fff;
}

.input,
.button {
  margin: 0;
  border: 1px solid gray;
  border-radius: 0.5rem;
  padding: 0.5rem;
  font-size: 1rem;
  line-height: 1.5;
}

.card-set-list {
  display: grid;
  gap: 1rem;
  padding-left: 0;
  list-style: none;
  overflow: hidden;
}

.card-set {
  display: block;
  border-bottom: 1px solid rgba(0, 0, 0, 0.2);
  padding: 1rem;
  text-decoration: none;
  color: inherit;
}

.list-move,
.list-enter-active,
.list-leave-active {
  transition: all 0.25s ease-out;
}
.list-enter-from,
.list-leave-to {
  transform: translateY(-100%);
}
</style>
