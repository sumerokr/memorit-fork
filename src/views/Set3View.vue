<script setup lang="ts">
import { computed } from "vue";
import { useGetCardSetById } from "@/composables/use-card-sets";
import { cardSetsById } from "@/services/card-sets-storage";
import { useRoute } from "vue-router";

type Props = {
  cardSetId: string;
};

const props = defineProps<Props>();

const route = useRoute();

const viewHideLink = computed(() => {
  return route.name === "cards"
    ? {
        to: { name: "set", params: { cardSetId: props.cardSetId } },
        text: "Hide",
      }
    : {
        to: { name: "cards", params: { cardSetId: props.cardSetId } },
        text: "View",
      };
});

const addCloseLink = computed(() => {
  return route.name === "new-card"
    ? {
        to: { name: "set", params: { cardSetId: props.cardSetId } },
        text: "Cancel",
      }
    : {
        to: { name: "new-card", params: { cardSetId: props.cardSetId } },
        text: "Add",
      };
});

const { isLoading, isReady, execute } = useGetCardSetById();
execute(props.cardSetId);

const cardSet = computed(() => {
  return cardSetsById.value[props.cardSetId];
});
</script>

<template>
  <div class="bg-neutral-100 flex-grow flex flex-col">
    <div class="p-4">
      <p class="">
        <RouterLink :to="{ name: 'sets' }" class="text-blue-500"
          ><span class="inline-block rotate-180">➜</span> Back to card
          sets</RouterLink
        >
      </p>
    </div>

    <div class="p-4">
      <template v-if="isReady">
        <div v-if="cardSet">
          <h1 class="text-4xl mb-2">{{ cardSet.title }}</h1>
          <p class="mb-4 text-xs opacity-50">Cards: {{ cardSet.cardsCount }}</p>

          <div class="flex flex-wrap gap-4 mb-4">
            <RouterLink
              :to="viewHideLink.to"
              class="flex-auto gap-2 px-4 py-2 items-center bg-blue-200 rounded-2xl flex justify-center"
              replace
            >
              {{ viewHideLink.text }}
              <span class="material-symbols-outlined text-xl leading-none">
                view_agenda
              </span>
            </RouterLink>
            <RouterLink
              :to="addCloseLink.to"
              class="flex-auto gap-2 px-4 py-2 items-center bg-blue-200 rounded-2xl flex justify-center"
              replace
            >
              {{ addCloseLink.text }}
              <span class="material-symbols-outlined text-xl leading-none">
                add
              </span>
            </RouterLink>
            <button
              class="flex-auto gap-2 px-4 py-2 items-center text-white font-bold bg-blue-400 rounded-2xl flex justify-center"
              type="button"
            >
              Study
              <span class="material-symbols-outlined text-xl leading-none"
                >play_arrow</span
              >
            </button>
          </div>
          <RouterView />
        </div>
        <div v-else>Error?</div>
      </template>
      <div v-else-if="isLoading">Loading...</div>
    </div>
  </div>
</template>

<style scoped></style>
