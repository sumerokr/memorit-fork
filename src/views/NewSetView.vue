<script setup lang="ts">
import { ref } from "vue";
import CardSetList from "@/components/CardSetList.vue";
import { useCreateCardSet } from "@/composables/use-card-sets";
import { cardSets } from "@/services/card-sets-storage";
import type { CardSetV2 } from "@/domain/card-set";

const { isLoading, execute } = useCreateCardSet();

const title = ref("");
const createdCardSets = ref<
  (CardSetV2 & {
    cardsCount: number;
    cardsToStudyCount: number;
  })[]
>([]);

const onSubmit = async () => {
  if (!title.value) {
    return;
  }

  await execute(title.value);

  title.value = "";

  const lastCreatedCardSet = cardSets.value.slice(-1)[0];
  createdCardSets.value.unshift({
    ...lastCreatedCardSet,
    cardsCount: 0,
    cardsToStudyCount: 0,
  });
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

    <form
      class="border rounded-xl mb-4 p-4 bg-white"
      @submit.prevent="onSubmit"
    >
      <p class="mb-4">
        <input
          v-model="title"
          id="title"
          class="leading-5 border-2 rounded-2xl p-2 w-full"
          type="text"
          placeholder="Card set title"
          autocomplete="off"
        />
      </p>
      <p class="text-right">
        <button
          class="inline-flex justify-center gap-2 px-4 py-2 items-center bg-indigo-200 rounded-2xl"
          type="submit"
          :disabled="isLoading"
        >
          <span>Save</span>
          <span class="material-symbols-outlined text-xl leading-none">
            save
          </span>
        </button>
      </p>
    </form>

    <CardSetList :cardSets="createdCardSets" />
  </div>
</template>
