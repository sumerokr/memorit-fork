<script setup lang="ts">
import { ref, computed } from "vue";
import { getStudyCardsUC } from "@/application/get-study-cards";
import { updateCardProgressUC } from "@/application/update-card-progress";
import { useAsyncState } from "@vueuse/core";
import RouterLinkIconButton from "@/components/RouterLinkIconButton.vue";
import CommonButton from "@/components/CommonButton.vue";
import WellDone from "@/components/WellDone.vue";

type Props = {
  cardSetId: string;
};

const props = defineProps<Props>();

const {
  isLoading: isGetStudyCardLoading,
  execute: getStudyCards,
  state: cards,
} = useAsyncState(() => getStudyCardsUC({ cardSetId: props.cardSetId }), null);

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
  return cards.value?.[current.value - 1]?.card;
});

const transitionName = ref("");
const results: [number, number, number] = [0, 0, 0];

const markHard = async () => {
  const { id } = currentCard.value!;
  isShown.value = false;
  current.value++;
  transitionName.value = "slide-left";
  results[0]++;
  await updateCardProgressExecute(0, { cardId: id, status: "failure" });
};
const markEasy = async () => {
  const { id } = currentCard.value!;
  isShown.value = false;
  current.value++;
  transitionName.value = "slide-right";
  results[2]++;
  await updateCardProgressExecute(0, { cardId: id, status: "success" });
};

const onRestart = async () => {
  await getStudyCards();
  current.value = 1;
  results[0] = results[1] = results[2] = 0;
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

    <div v-if="isGetStudyCardLoading">Loading...</div>

    <div v-else-if="total <= 0" class="mt-4">No cards to study (for now). Check again later.</div>

    <template v-else-if="currentCard">
      <p class="mb-4 text-sm opacity-60">Card: {{ current }} / {{ total }}</p>
      <div class="_card relative mb-4">
        <Transition :name="transitionName">
          <div class="border rounded-xl p-4 bg-white absolute inset-0" :key="currentCard.id">
            <div class="grid _grid h-full" :class="isShown ? '_grid-show' : '_grid-hide'">
              <p class="flex items-center justify-center">
                <span class="text-center text-2xl">{{ currentCard.front }}</span>
              </p>
              <p class="_back flex items-center justify-center overflow-hidden">
                <span class="text-center text-xl">{{ currentCard.back }}</span>
              </p>
            </div>
          </div>
        </Transition>
      </div>

      <div v-if="isShown" class="border rounded-xl p-4 bg-white">
        <p class="mb-2 text-sm opacity-60">How well did you know the answer?</p>
        <div class="flex flex-wrap gap-4">
          <CommonButton
            icon="sentiment_dissatisfied"
            class="flex-1 bg-red-200"
            :disabled="isUpdateCardProgressLoading"
            @click="markHard"
            >Forgot</CommonButton
          >
          <CommonButton
            icon="sentiment_satisfied"
            class="flex-1 bg-green-200"
            :disabled="isUpdateCardProgressLoading"
            @click="markEasy"
            >Remember</CommonButton
          >
        </div>
      </div>

      <div v-else class="border rounded-xl p-4 bg-white">
        <p class="mb-2 text-sm opacity-60">Do you remember the card? Let's find out</p>
        <div class="flex">
          <CommonButton class="flex-grow bg-indigo-200" @click="isShown = !isShown">
            Reveal
          </CommonButton>
        </div>
      </div>
    </template>

    <WellDone v-else :card-set-id="cardSetId" :results="results" @restart="onRestart" />
  </div>
</template>

<style scoped>
._card {
  height: clamp(10rem, 50vh, 24rem);
}

._grid {
  will-change: grid-template-rows;
  transition: grid-template-rows 0.2s;
}

._grid-hide {
  grid-template-rows: 100% 0;
}

._grid-show {
  grid-template-rows: 50% 50%;
}

._back {
  box-shadow: inset 0 1px 0 #e5e7eb;
}

.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active {
  transition: transform 0.2s ease-in;
}

.slide-left-enter-from,
.slide-right-enter-from {
  z-index: 0;
  transform: scale(80%);
}

.slide-right-leave-active,
.slide-left-leave-active {
  z-index: 1;
}

.slide-left-leave-to {
  transform: translateX(calc(-100% - 1rem));
}

.slide-right-leave-to {
  transform: translateX(calc(100% - 1rem));
}
</style>
