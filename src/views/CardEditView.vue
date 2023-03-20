<script setup lang="ts">
import { ref, computed, watch, nextTick } from "vue";
import { useUpdateCard, useGetCard } from "@/composables/use-cards";
import { cards } from "@/services/cards-storage";
import CommonButton from "@/components/CommonButton.vue";
import router from "@/router";

type Props = {
  cardSetId: string;
  id: string;
};

const props = defineProps<Props>();

const card = computed(() => {
  return cards.value.find((_card) => _card.id === props.id);
});

const {
  isLoading: isGetCardLoading,
  isReady: isGetCardReady,
  execute: getCard,
} = useGetCard();
getCard(props.id);

const { isLoading: isUpdateCardLoading, execute: updateCard } = useUpdateCard();

const front = ref("");
const frontEl = ref<HTMLInputElement>();
const back = ref("");

watch(isGetCardReady, async (flag) => {
  if (flag) {
    await nextTick();
    frontEl.value?.focus();
  }
});

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
    <p class="mb-4">
      <RouterLink
        :to="{ name: 'cards', params: { cardSetId } }"
        class="text-indigo-500"
        ><span class="inline-block rotate-180">➜</span> Back to card
        set</RouterLink
      >
    </p>

    <h1 class="text-3xl mb-4">Edit card</h1>

    <div v-if="isGetCardLoading">Loading...</div>

    <form
      v-if="isGetCardReady && card"
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
          :disabled="isUpdateCardLoading"
          >Save</CommonButton
        >
      </p>
    </form>
  </div>
</template>
