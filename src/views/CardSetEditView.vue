<script setup lang="ts">
import { ref, computed, watch } from "vue";
import {
  useGetCardSetById,
  useUpdateCardSet,
} from "@/composables/use-card-sets";
import { cardSets } from "@/services/card-sets-storage";

type Props = {
  cardSetId: string;
};

const props = defineProps<Props>();

const cardSet = computed(() => {
  return cardSets.value.find((_cardSet) => _cardSet.id === props.cardSetId);
});

const {
  isLoading: isGetCardSetLoading,
  isReady: isGetCardSetReady,
  execute: getCard,
} = useGetCardSetById();
getCard(props.cardSetId);

const { isLoading: isUpdateCardSetLoading, execute: updateCardSet } =
  useUpdateCardSet();

const title = ref("");
const showNotification = ref(false);

const fillCard = () => {
  if (cardSet.value) {
    title.value = cardSet.value.title;
  }
};
fillCard();

watch(cardSet, () => {
  fillCard();
});

const onSubmit = async () => {
  await updateCardSet(props.cardSetId, {
    title: title.value,
  });

  showNotification.value = true;
  setTimeout(() => {
    showNotification.value = false;
  }, 3000);
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

    <h1 class="text-3xl mb-4">Edit card set</h1>

    <div v-if="isGetCardSetLoading">Loading...</div>

    <form
      v-if="isGetCardSetReady && cardSet"
      class="border rounded-xl mb-4 p-4 bg-white"
      @submit.prevent="onSubmit"
    >
      <p class="mb-4">
        <input
          v-model="title"
          id="title"
          class="leading-5 border-2 rounded-2xl p-2 w-full"
          type="text"
          placeholder="Card set title"
          autocomplete="off"
        />
      </p>
      <p class="text-right">
        <span v-if="showNotification" class="mr-2 text-green-700">
          Saved!
        </span>
        <button
          class="inline-flex justify-center gap-2 px-4 py-2 items-center bg-indigo-200 rounded-2xl"
          type="submit"
          :disabled="isUpdateCardSetLoading"
        >
          <span>Save</span>
          <span class="material-symbols-outlined text-xl leading-none">
            save
          </span>
        </button>
      </p>
    </form>
  </div>
</template>
