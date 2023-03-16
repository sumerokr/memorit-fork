<script setup lang="ts">
import { ref } from "vue";
import CardList from "@/components/CardList.vue";
import { useCreateCard } from "@/composables/use-cards";
import { cardsByCardSetId } from "@/services/cards-storage";
import type { Card } from "@/domain/card";

type Props = {
  cardSetId: string;
};

const props = defineProps<Props>();

const { isLoading, execute } = useCreateCard();

const front = ref("");
const frontEl = ref<HTMLInputElement>();
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

  frontEl.value?.focus();

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

    <form
      class="mb-4 border rounded-xl p-4 bg-white"
      @submit.prevent="onSubmit"
    >
      <p class="mb-4">
        <input
          v-model="front"
          id="front"
          class="leading-5 border-2 rounded-2xl p-2 w-full"
          type="text"
          placeholder="Card front"
          autocomplete="off"
          ref="frontEl"
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
          class="inline-flex justify-center gap-2 px-4 py-2 items-center bg-indigo-200 rounded-2xl"
          type="submit"
          :disabled="isLoading"
        >
          <span>Save</span>
          <span class="material-symbols-outlined text-xl leading-none">
            save
          </span>
        </button>
      </p>
    </form>

    <CardList :cards="createdCards" />
  </div>
</template>
