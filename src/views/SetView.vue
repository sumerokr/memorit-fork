<script setup lang="ts">
import { computed } from "vue";
import { useGetCardSetById } from "@/composables/use-card-sets";
import { cardSetsById } from "@/services/card-sets-storage";

type Props = {
  cardSetId: string;
};

const props = defineProps<Props>();

const { isLoading, isReady, execute } = useGetCardSetById();
execute(props.cardSetId);

const cardSet = computed(() => {
  return cardSetsById.value[props.cardSetId];
});
</script>

<template>
  <div class="flex-grow flex flex-col p-4 bg-neutral-100">
    <p class="mb-4">
      <RouterLink :to="{ name: 'sets' }" class="text-indigo-500"
        ><span class="inline-block rotate-180">➜</span> Back to card
        sets</RouterLink
      >
    </p>

    <template v-if="isReady">
      <div v-if="cardSet" class="border rounded-xl p-4 bg-white">
        <h1 class="text-3xl mb-4">{{ cardSet.title }}</h1>
        <p class="mb-8 opacity-60">Cards: {{ cardSet.cardsCount }}</p>

        <div class="flex flex-wrap gap-4">
          <RouterLink
            :to="{ name: 'cards', params: { cardSetId: props.cardSetId } }"
            class="flex-grow gap-2 px-4 py-2 items-center bg-indigo-50 rounded-2xl flex justify-center"
          >
            View
            <span class="material-symbols-outlined text-xl leading-none">
              view_agenda
            </span>
          </RouterLink>
          <RouterLink
            :to="{ name: 'new-card', params: { cardSetId: props.cardSetId } }"
            class="flex-grow gap-2 px-4 py-2 items-center bg-indigo-50 rounded-2xl flex justify-center"
          >
            Add
            <span class="material-symbols-outlined text-xl leading-none">
              add
            </span>
          </RouterLink>
          <RouterLink
            :to="{ name: 'study', params: { cardSetId: props.cardSetId } }"
            class="flex-grow gap-2 px-4 py-2 items-center bg-indigo-200 rounded-2xl flex justify-center"
          >
            Study
            <span class="material-symbols-outlined text-xl leading-none"
              >play_arrow</span
            >
          </RouterLink>
        </div>
      </div>
      <div v-else>Error?</div>
    </template>
    <div v-else-if="isLoading">Loading...</div>
  </div>
</template>
