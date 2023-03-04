<script setup lang="ts">
import { computed } from "vue";
import CardList from "@/components/CardList.vue";
import { useGetCardsByCardSetId } from "@/composables/use-cards";
import { cardsByCardSetId } from "@/services/cards-storage";

type Props = {
  cardSetId: string;
};

const props = defineProps<Props>();

const { isLoading, isReady, execute } = useGetCardsByCardSetId();
execute(props.cardSetId);

const cards = computed(() => {
  return cardsByCardSetId.value[props.cardSetId] ?? [];
});
</script>

<template>
  <div class="flex-grow bg-neutral-100 p-4">
    <p class="mb-4">
      <RouterLink
        :to="{ name: 'set', params: { cardSetId } }"
        class="text-indigo-500"
        ><span class="inline-block rotate-180">➜</span> Back to card
        set</RouterLink
      >
    </p>

    <h1 class="text-2xl mb-4">Cards</h1>
    <template v-if="isReady">
      <CardList v-if="cards.length" :cards="cards" />
      <p v-else>
        You have no cards yet.
        <RouterLink
          :to="{ name: 'new-card', params: { cardSetId: props.cardSetId } }"
          class="gap-2 px-4 py-2 items-center bg-indigo-200 rounded-2xl inline-flex justify-center"
        >
          Create
          <span class="material-symbols-outlined text-xl leading-none">
            add
          </span>
        </RouterLink>
      </p>
    </template>
    <p v-else-if="isLoading">Loading...</p>
    <RouterLink
      class="fixed right-4 bottom-4 p-4 flex rounded-2xl bg-indigo-200 shadow-md"
      :to="{ name: 'new-card' }"
      ><span class="material-symbols-outlined text-2xl leading-none">
        add
      </span></RouterLink
    >
  </div>
</template>
