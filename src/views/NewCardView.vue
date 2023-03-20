<script setup lang="ts">
import { ref, onMounted } from "vue";
import CardList from "@/components/CardList.vue";
import { useCreateCard } from "@/composables/use-cards";
import { cardsByCardSetId } from "@/services/cards-storage";
import type { Card } from "@/domain/card";
import CommonButton from "@/components/CommonButton.vue";

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
  const frontTrimmed = front.value.trim();
  const backTrimmed = back.value.trim();

  if (!frontTrimmed || !backTrimmed) {
    return;
  }

  await execute({
    front: frontTrimmed,
    back: backTrimmed,
    cardSetId: props.cardSetId,
  });

  front.value = "";
  back.value = "";

  frontEl.value?.focus();

  const lastCreatedCard = cardsByCardSetId.value[props.cardSetId].slice(-1)[0];
  createdCards.value.unshift(lastCreatedCard);
};

onMounted(() => {
  frontEl.value?.focus();
});
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
        <CommonButton
          before="save"
          class="bg-indigo-200"
          type="submit"
          :disabled="isLoading"
          >Save</CommonButton
        >
      </p>
    </form>

    <CardList :cards="createdCards" />
  </div>
</template>
