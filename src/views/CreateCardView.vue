<script setup lang="ts">
import { ref } from "vue";
import CardList from "@/components/CardList.vue";
import type { Card } from "@/domain/card";
import { createCardUC } from "@/application/create-card";
import { useAsyncState } from "@vueuse/core";
import NewCardForm from "@/components/CardForm.vue";
import RouterLinkIconButton from "@/components/RouterLinkIconButton.vue";

type Props = {
  cardSetId: string;
};

const props = defineProps<Props>();

const front = ref("");
const back = ref("");

const createdCards = ref<Card[]>([]);

const { isLoading, execute } = useAsyncState(createCardUC, null, {
  immediate: false,
  onSuccess: (card) => {
    if (!card) {
      return;
    }

    createdCards.value.unshift(card);

    front.value = "";
    back.value = "";
  },
});

const handleCreateCard = async () => {
  if (!front.value || !back.value) {
    return;
  }

  await execute(0, {
    front: front.value,
    back: back.value,
    cardSetId: props.cardSetId,
  });
};
</script>

<template>
  <div class="flex flex-col flex-grow p-4 bg-neutral-100">
    <div class="flex items-center mb-4">
      <RouterLinkIconButton
        icon="arrow_back"
        class="-ml-3 mr-1"
        :to="{ name: 'set', params: { cardSetId } }"
        >Back</RouterLinkIconButton
      >
      <h1 class="text-2xl">Add new card</h1>
    </div>

    <NewCardForm
      v-model:front.trim="front"
      v-model:back.trim="back"
      :is-loading="isLoading"
      @submit="handleCreateCard"
    />

    <CardList :cards="createdCards" />
  </div>
</template>
