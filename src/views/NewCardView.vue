<script setup lang="ts">
import { ref, watch } from "vue";
import CardList from "@/components/CardList.vue";
import { useCreateCard } from "@/composables/use-cards";
import { cardsByCardSetId } from "@/services/cards-storage";
import type { Card } from "@/domain/card";

type Props = {
  cardSetId: string;
};

const props = defineProps<Props>();

const { isReady, isLoading, execute } = useCreateCard();

const front = ref("");
const back = ref("");
const createdCards = ref<Card[]>([]);

const onSubmit = async () => {
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
  <form class="mb-4 border rounded-2xl p-4 bg-white" @submit.prevent="onSubmit">
    <p class="mb-4">
      <input
        v-model="front"
        id="front"
        class="leading-5 border-2 rounded-2xl p-2 w-full"
        type="text"
        placeholder="Card front"
        autocomplete="off"
      />
    </p>
    <p class="mb-4">
      <input
        v-model="back"
        id="back"
        class="leading-5 border-2 rounded-2xl p-2 w-full"
        type="text"
        placeholder="Card back"
        autocomplete="off"
      />
    </p>
    <p class="text-right">
      <button
        class="inline-flex justify-center gap-2 px-4 py-2 items-center text-white font-bold bg-blue-400 rounded-2xl"
        type="submit"
      >
        <span>Save</span>
        <span class="material-symbols-outlined text-xl leading-none">
          save
        </span>
      </button>
    </p>
  </form>

  <CardList :cards="createdCards" />
</template>
