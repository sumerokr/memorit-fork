<script setup lang="ts">
import { ref, computed, watch } from "vue";
import shuffle from "lodash/shuffle";
import { getOneOfFourCardsUC } from "@/application/get-one-of-four-cards";
import { updateCardProgressUC } from "@/application/update-card-progress";
import { useAsyncState } from "@vueuse/core";
import RouterLinkIconButton from "@/components/RouterLinkIconButton.vue";
import CommonButton from "@/components/CommonButton.vue";
import WellDone from "@/components/WellDone.vue";
import type { Card } from "@/domain/card";

type Props = {
  cardSetId: string;
};

const props = defineProps<Props>();

const {
  isLoading: isGetOneOfFourCardLoading,
  execute: getOneOfFourCards,
  state: cards,
} = useAsyncState(() => getOneOfFourCardsUC({ cardSetId: props.cardSetId }), null);

const { isLoading: isUpdateCardProgressLoading, execute: updateCardProgressExecute } =
  useAsyncState(updateCardProgressUC, null, {
    immediate: false,
  });

const isShown = ref(false);

const total = computed(() => {
  return cards.value?.length || 0;
});
const current = ref(1);

const currentCard = computed(() => {
  return cards.value?.[current.value - 1];
});

const answers = computed(() => shuffle([currentCard.value!.card, ...currentCard.value!.rest]));

const results: [number, number] = [0, 0];

const markFailure = async () => {
  const { id } = currentCard.value!.card;
  results[0]++;
  await updateCardProgressExecute(0, { cardId: id, status: "failure" });
};

const markSuccess = async () => {
  const { id } = currentCard.value!.card;
  results[1]++;
  await updateCardProgressExecute(0, { cardId: id, status: "success" });
};

const answer = ref<Card["id"] | null>(null);
watch(answer, async (newAnswer, prevAnswer) => {
  if (newAnswer === null || prevAnswer !== null || isUpdateCardProgressLoading.value) {
    return;
  }

  isShown.value = true;
  answer.value = newAnswer;

  if (newAnswer === currentCard.value!.card.id) {
    await markSuccess();
  } else {
    await markFailure();
  }
});

const next = () => {
  isShown.value = false;
  current.value++;
  answer.value = null;
};

const onRestart = async () => {
  await getOneOfFourCards();
  current.value = 1;
  results[0] = results[1] = 0;
};
</script>

<template>
  <div class="flex flex-col flex-grow bg-neutral-100 p-4 overflow-hidden">
    <div class="flex items-center mb-4">
      <RouterLinkIconButton
        icon="arrow_back"
        class="-ml-3 mr-1"
        :to="{ name: 'set', params: { cardSetId } }"
        >Back</RouterLinkIconButton
      >
      <h1 class="text-2xl">Study</h1>
      <div class="ml-auto -mr-3 relative"></div>
    </div>

    <div v-if="isGetOneOfFourCardLoading">Loading...</div>

    <div v-else-if="total <= 0" class="mt-4">No cards to study (for now). Check again later.</div>

    <template v-else-if="currentCard?.card">
      <p class="mb-4 text-sm opacity-60">Card: {{ current }} / {{ total }}</p>
      <div class="_card relative mb-4">
        <Transition name="slide-left">
          <div class="border rounded-xl p-4 bg-white absolute inset-0" :key="currentCard!.card.id">
            <div class="grid _grid h-full">
              <p class="flex items-center justify-center">
                <span class="text-center text-2xl">{{ currentCard!.card.front }}</span>
              </p>
            </div>
          </div>
        </Transition>
      </div>

      <div class="mb-4 border rounded-xl p-4 bg-white">
        <p class="mb-2 text-sm opacity-60">Pick the right answer</p>
        <div class="flex flex-col gap-2">
          <label
            class="border rounded p-4 flex gap-4 items-start text-sm"
            :class="{
              '!bg-red-200': answer && answer === card.id && card.id !== currentCard!.card.id,
              '!bg-green-200': answer && answer === card.id && card.id === currentCard!.card.id,
            }"
            :for="card.id"
            v-for="card in answers"
            :key="card.id"
          >
            <input
              class="hidden"
              type="radio"
              name="answer"
              :id="card.id"
              :value="card.id"
              :disabled="answer !== null"
              v-model="answer"
            />
            <span>{{ card.back }}</span>
          </label>
        </div>
      </div>

      <div class="border rounded-xl p-4 bg-white">
        <div class="flex">
          <CommonButton class="flex-grow bg-indigo-200" @click="next" :disabled="!isShown">
            Next
          </CommonButton>
        </div>
      </div>
    </template>

    <WellDone v-else :card-set-id="cardSetId" :results="results" @restart="onRestart" />
  </div>
</template>

<style scoped>
._card {
  height: clamp(10rem, 20vh, 24rem);
}

.slide-left-enter-active,
.slide-left-leave-active {
  transition: transform 0.2s ease-in;
}

.slide-left-enter-from {
  z-index: 0;
  transform: scale(80%);
}

.slide-left-leave-active {
  z-index: 1;
}

.slide-left-leave-to {
  transform: translateX(calc(-100% - 1rem));
}
</style>
