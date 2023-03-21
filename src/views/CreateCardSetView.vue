<script setup lang="ts">
import { ref } from "vue";
import CardSetList from "@/components/CardSetList.vue";
import type { CardSetV2 } from "@/domain/card-set";
import { createCardSetUC } from "@/application/create-card-set";
import { useAsyncState } from "@vueuse/core";
import CardSetForm from "@/components/CardSetForm.vue";

const title = ref("");
const createdCardSets = ref<
  (CardSetV2 & {
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
});

const onSubmit = async () => {
  if (isLoading.value) {
    return;
  }

  if (!title.value) {
    return;
  }

  await execute(0, { title: title.value });
};
</script>

<template>
  <div class="flex flex-col flex-grow p-4 bg-neutral-100">
    <p class="mb-4">
      <RouterLink :to="{ name: 'sets' }" class="text-indigo-500"
        ><span class="inline-block rotate-180">➜</span> Back to card
        sets</RouterLink
      >
    </p>

    <h1 class="text-3xl mb-4">Add new card set</h1>

    <CardSetForm
      v-model:title.trim="title"
      :is-loading="isLoading"
      @submit="onSubmit"
    />

    <CardSetList :cardSets="createdCardSets" />
  </div>
</template>
