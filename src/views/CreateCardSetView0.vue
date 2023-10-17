<script setup lang="ts">
import { ref } from "vue";
import CardSetList from "@/components/CardSetList.vue";
import type { CardSet } from "@/domain/card-set";
import { createCardSetUC } from "@/application/create-card-set";
import { useAsyncState } from "@vueuse/core";
import CardSetForm from "@/components/CardSetForm.vue";
import RouterLinkIconButton from "@/components/RouterLinkIconButton.vue";
import IconButton from "@/components/IconButton.vue";

const title = ref("");
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
    <div class="flex items-center mb-4">
      <RouterLinkIconButton
        icon="arrow_back"
        class="-ml-3 mr-1"
        :to="{ name: 'sets' }"
        >Back</RouterLinkIconButton
      >
      <h1 class="text-2xl">Add new card set</h1>
    </div>

    <ul class="bg-white rounded-2xl py-2 divide-y">
      <li>
        <RouterLink
          :to="{ name: 'new-card-set-create' }"
          class="flex items-start gap-1 px-1 py-2.5"
        >
          <IconButton icon="add" class="" />
          <div class="py-0.5">
            <h2 class="font-medium">Create manually</h2>
            <p class="text-sm opacity-60">Some descriptions goes here</p>
          </div>
        </RouterLink>
      </li>

      <li>
        <RouterLink
          :to="{ name: 'new-card-set-generate' }"
          class="flex items-start gap-1 px-1 py-2.5"
        >
          <IconButton icon="magic_button" class="" />
          <div class="py-0.5">
            <h2 class="font-medium">Generate with AI</h2>
            <p class="text-sm opacity-60">Some descriptions goes here</p>
          </div>
        </RouterLink>
      </li>
    </ul>
  </div>
</template>
