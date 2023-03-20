<script setup lang="ts">
import { ref, onMounted } from "vue";
import CardSetList from "@/components/CardSetList.vue";
import type { CardSetV2 } from "@/domain/card-set";
import { createCardSetUC } from "@/application/create-card-set";
import { useAsyncState } from "@vueuse/core";
import CommonButton from "@/components/CommonButton.vue";

const title = ref("");
const titleEl = ref<HTMLInputElement>();
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
    titleEl.value?.focus();
  },
});

const onSubmit = async () => {
  if (isLoading.value) {
    return;
  }

  const trimmed = title.value.trim();
  if (!trimmed) {
    return;
  }

  await execute(0, { title: trimmed });
};

onMounted(() => {
  titleEl.value?.focus();
});
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
          ref="titleEl"
        />
      </p>
      <p class="text-right">
        <CommonButton
          before="save"
          class="bg-indigo-200"
          type="submit"
          :disabled="isLoading"
          >Save
        </CommonButton>
      </p>
    </form>

    <CardSetList :cardSets="createdCardSets" />
  </div>
</template>
