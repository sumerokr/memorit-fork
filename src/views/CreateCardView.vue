<script setup lang="ts">
import { ref } from "vue";
import CardList from "@/components/CardList.vue";
import { useCreateCard } from "@/composables/use-cards";
import { cardsByCardSetId } from "@/services/cards-storage";
import type { Card } from "@/domain/card";
import NewCardForm from "@/components/CardForm.vue";
import RouterLinkIconButton from "@/components/RouterLinkIconButton.vue";

type Props = {
  cardSetId: string;
};

const props = defineProps<Props>();

const { isLoading, execute } = useCreateCard();

const front = ref("");
const back = ref("");

const createdCards = ref<Card[]>([]);

const onSubmit = async () => {
  if (!front.value || !back.value) {
    return;
  }

  await execute({
    front: front.value,
    back: back.value,
    cardSetId: props.cardSetId,
  });

  front.value = "";
  back.value = "";

  const lastCreatedCard = cardsByCardSetId.value[props.cardSetId].slice(-1)[0];
  createdCards.value.unshift(lastCreatedCard);
};

const backLink = window.history.state?.back;
</script>

<template>
  <div class="flex flex-col flex-grow p-4 bg-neutral-100">
    <div class="flex items-center mb-4">
      <RouterLinkIconButton
        icon="arrow_back"
        class="-ml-3 mr-1"
        :to="backLink ?? { name: 'set', params: { cardSetId } }"
        >Back</RouterLinkIconButton
      >
      <h1 class="text-2xl">Add new card</h1>
    </div>

    <NewCardForm
      v-model:front.trim="front"
      v-model:back.trim="back"
      :is-loading="isLoading"
      @submit="onSubmit"
    />

    <CardList :cards="createdCards" />
  </div>
</template>
