<script setup lang="ts">
import { ref } from "vue";
import CardSetList from "@/components/CardSetList.vue";
import type { CardSet } from "@/domain/card-set";
import { createCardSetUC } from "@/application/create-card-set";
import { useAsyncState } from "@vueuse/core";
import CardSetForm from "@/components/CardSetForm.vue";
import RouterLinkIconButton from "@/components/RouterLinkIconButton.vue";

const title = ref("");
const error = ref("");
const createdCardSets = ref<
  (CardSet & {
    cardsCount: number;
    cardsToStudyCount: number;
  })[]
>([]);

const { isLoading, execute } = useAsyncState(createCardSetUC, null, {
  immediate: false,
  onSuccess: (cardSet) => {
    if (!cardSet) {
      return;
    }

    createdCardSets.value.unshift({
      ...cardSet,
      cardsCount: 0,
      cardsToStudyCount: 0,
    });

    title.value = "";
  },
  onError: (err) => {
    error.value = String(err);
  },
});

const onSubmit = async () => {
  if (isLoading.value) {
    return;
  }

  if (!title.value) {
    return;
  }

  console.time("submit");
  await execute(0, { title: title.value });
  console.timeEnd("submit");
};
</script>

<template>
  <div class="flex flex-col flex-grow p-4 bg-neutral-100">
    <div class="flex items-center mb-4">
      <RouterLinkIconButton
        icon="arrow_back"
        class="-ml-3 mr-1"
        :to="{ name: 'sets' }"
        >Back</RouterLinkIconButton
      >
      <h1 class="text-2xl">Add new card set</h1>
    </div>

    <CardSetForm
      v-model:title.trim="title"
      :is-loading="isLoading"
      @submit="onSubmit"
    />

    <p v-if="error">{{ error }}</p>
    <CardSetList :cardSets="createdCardSets" />
  </div>
</template>
