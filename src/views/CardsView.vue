<script setup lang="ts">
import type { Card } from "@/domain/card";
import { useAsyncState } from "@vueuse/core";
import { getCardsUC } from "@/application/get-cards";
import { deleteCardUC } from "@/application/delete-card";
import CardList from "@/components/CardList.vue";
import RouterLinkCommonButton from "@/components/RouterLinkCommonButton.vue";
import RouterLinkIconButton from "@/components/RouterLinkIconButton.vue";

type Props = {
  cardSetId: string;
};

const props = defineProps<Props>();

const {
  state: cards,
  isLoading: isGetCardsLoading,
  error: getCardsError,
  execute: getCards,
} = useAsyncState(() => getCardsUC({ cardSetId: props.cardSetId }), null, {
  resetOnExecute: false,
});

const { isLoading: isDeleteCardLoading, execute: deleteCard } = useAsyncState(
  ({ id }: { id: Card["id"] }) => deleteCardUC({ id }),
  null,
  {
    immediate: false,
    onSuccess: () => {
      getCards();
    },
  }
);

const handleDeleteCard = async (id: Card["id"]) => {
  await deleteCard(0, { id });
};
</script>

<template>
  <div class="flex flex-col flex-grow bg-neutral-100 p-4 pb-24">
    <div class="flex items-center mb-4">
      <RouterLinkIconButton
        icon="arrow_back"
        class="-ml-3 mr-1"
        :to="{ name: 'set', params: { cardSetId } }"
        >Back</RouterLinkIconButton
      >
      <h1 class="text-2xl">Cards</h1>
    </div>

    <p v-if="getCardsError" class="mb-4 border border-red-500 rounded-2xl p-4 bg-red-50">
      {{ getCardsError }}
    </p>

    <CardList v-if="cards?.length" :cards="cards" @delete="handleDeleteCard" />

    <div class="my-auto text-center" v-else-if="cards && !cards.length">
      You have no cards yet.
      <RouterLinkCommonButton
        before="add"
        :to="{ name: 'new-card', params: { cardSetId: cardSetId } }"
        class="bg-indigo-200"
      >
        Create
      </RouterLinkCommonButton>
    </div>

    <RouterLink
      class="fixed right-4 bottom-4 p-4 flex rounded-2xl bg-indigo-500 text-white shadow-md"
      :to="{ name: 'new-card', params: { cardSetId } }"
      ><span class="material-symbols-rounded text-2xl leading-none"> add </span></RouterLink
    >
  </div>
</template>
