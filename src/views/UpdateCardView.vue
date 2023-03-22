<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { useUpdateCard, useGetCard } from "@/composables/use-cards";
import { cards } from "@/services/cards-storage";
import CardForm from "@/components/CardForm.vue";
import RouterLinkIconButton from "@/components/RouterLinkIconButton.vue";

import router from "@/router";

type Props = {
  cardSetId: string;
  id: string;
};

const props = defineProps<Props>();

const card = computed(() => {
  return cards.value.find((_card) => _card.id === props.id);
});

const { isLoading: isGetCardLoading, execute: getCard } = useGetCard();
getCard(props.id);

const { isLoading: isUpdateCardLoading, execute: updateCard } = useUpdateCard();

const front = ref("");
const back = ref("");

const fillCard = () => {
  if (card.value) {
    front.value = card.value.front;
    back.value = card.value.back;
  }
};
fillCard();

watch(card, () => {
  fillCard();
});

const onSubmit = async () => {
  await updateCard(props.id, {
    front: front.value,
    back: back.value,
  });

  router.push({ name: "cards", params: { cardSetId: props.cardSetId } });
};
</script>

<template>
  <div class="flex flex-col flex-grow p-4 bg-neutral-100">
    <div class="flex items-center mb-4">
      <RouterLinkIconButton
        icon="arrow_back"
        class="-ml-3 mr-1"
        :to="{ name: 'cards', params: { cardSetId } }"
        >Back</RouterLinkIconButton
      >
      <h1 class="text-2xl">Update card</h1>
    </div>

    <div v-if="isGetCardLoading">Loading...</div>

    <CardForm
      v-if="card"
      v-model:front.trim="front"
      v-model:back.trim="back"
      :is-loading="isUpdateCardLoading"
      @submit="onSubmit"
    />
  </div>
</template>
