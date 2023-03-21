<script setup lang="ts">
import { ref } from "vue";
import CardList from "@/components/CardList.vue";
import { useCreateCard } from "@/composables/use-cards";
import { cardsByCardSetId } from "@/services/cards-storage";
import type { Card } from "@/domain/card";
import NewCardForm from "@/components/CardForm.vue";

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
</script>

<template>
  <div class="flex flex-col flex-grow p-4 bg-neutral-100">
    <p class="mb-4">
      <RouterLink
        :to="{ name: 'set', params: { cardSetId } }"
        class="text-indigo-500"
        ><span class="inline-block rotate-180">➜</span> Back to card
        set</RouterLink
      >
    </p>

    <h1 class="text-3xl mb-4">Add new card</h1>

    <NewCardForm
      v-model:front.trim="front"
      v-model:back.trim="back"
      :is-loading="isLoading"
      @submit="onSubmit"
    />

    <CardList :cards="createdCards" />
  </div>
</template>
