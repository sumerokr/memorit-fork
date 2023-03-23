<script setup lang="ts">
import { ref, computed } from "vue";
import type { Card } from "@/domain/card";
import { useGetStudyCards, useUpdateCardStatus } from "@/composables/use-cards";
import { cards } from "@/services/cards-storage";
import IconButton from "@/components/IconButton.vue";
import CommonButton from "@/components/CommonButton.vue";
import RouterLinkIconButton from "@/components/RouterLinkIconButton.vue";

type Props = {
  cardSetId: string;
};

const props = defineProps<Props>();

const { isLoading, isReady, execute } = useGetStudyCards();
execute(props.cardSetId);

const { isLoading: isUpdateLoading, execute: updateCardStatus } =
  useUpdateCardStatus();

const isShown = ref(false);

const total = computed(() => {
  return cards.value.length;
});
const current = ref(1);

const currentCard = computed(() => {
  return cards.value[current.value - 1];
});

const results: [number, number, number] = [0, 0, 0];

const markHard = async () => {
  const { id } = currentCard.value;
  isShown.value = false;
  current.value++;
  results[0]++;
  const newProgress = 1;
  await updateCardStatus({ id, progress: newProgress });
};
const markOk = async () => {
  const { id, progress } = currentCard.value;
  isShown.value = false;
  current.value++;
  results[1]++;
  const newProgress = Math.max(progress - 1, 1) as Card["progress"];
  await updateCardStatus({ id, progress: newProgress });
};
const markEasy = async () => {
  const { id, progress } = currentCard.value;
  isShown.value = false;
  current.value++;
  results[2]++;
  const newProgress = (progress <= 9 ? progress + 1 : 10) as Card["progress"];
  await updateCardStatus({ id, progress: newProgress });
};

const onRestart = () => {
  execute(props.cardSetId);
  current.value = 1;
  results[0] = results[1] = results[2] = 0;
};
</script>

<template>
  <div class="flex-grow bg-neutral-100 p-4">
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

    <div v-if="isLoading">Loading...</div>

    <template v-else-if="isReady && total > 0">
      <template v-if="current <= total">
        <p class="mb-4 text-sm opacity-60">Card: {{ current }} / {{ total }}</p>
        <div class="_card relative mb-4">
          <Transition name="slide-left">
            <div
              class="border rounded-xl p-4 bg-white absolute inset-0"
              :key="currentCard.id"
            >
              <div
                class="grid _grid h-full"
                :class="isShown ? '_grid-show' : '_grid-hide'"
              >
                <p class="flex items-center justify-center">
                  <span class="text-center text-2xl">{{
                    currentCard.front
                  }}</span>
                </p>
                <p
                  class="_back flex items-center justify-center overflow-hidden"
                >
                  <span class="text-center text-xl">{{
                    currentCard.back
                  }}</span>
                </p>
              </div>
            </div>
          </Transition>
        </div>

        <div v-if="isShown" class="border rounded-xl p-4 bg-white">
          <p class="mb-2 text-sm opacity-60">
            How well did you know the answer?
          </p>
          <div class="flex flex-wrap gap-4">
            <IconButton
              icon="sentiment_dissatisfied"
              class="bg-red-200 flex-grow"
              :disabled="isUpdateLoading"
              @click="markHard"
            />
            <IconButton
              icon="sentiment_neutral"
              class="bg-yellow-200 flex-grow"
              :disabled="isUpdateLoading"
              @click="markOk"
            />
            <IconButton
              icon="sentiment_satisfied"
              class="bg-green-200 flex-grow"
              :disabled="isUpdateLoading"
              @click="markEasy"
            />
          </div>
        </div>

        <div v-else class="border rounded-xl p-4 bg-white">
          <p class="mb-2 text-sm opacity-60">
            Do you remember the card? Let's find out
          </p>
          <div class="flex">
            <CommonButton
              class="flex-grow bg-indigo-200"
              @click="isShown = !isShown"
            >
              Reveal
            </CommonButton>
          </div>
        </div>
      </template>

      <div v-else>
        <p class="mb-4">Congrats! You have studied {{ total }} cards.</p>
        <div
          class="flex mb-24 h-4 border-2 border-neutral-500 rounded-xl overflow-hidden"
        >
          <div
            class="bg-red-200 text-xs"
            :style="`width: ${(results[0] / total) * 100}%`"
          ></div>
          <div
            class="bg-yellow-200"
            :style="`width: ${(results[1] / total) * 100}%`"
          ></div>
          <div
            class="bg-green-200"
            :style="`width: ${(results[2] / total) * 100}%`"
          ></div>
        </div>
        <p class="mt-4 text-center">
          You can
          <CommonButton
            before="play_arrow"
            class="bg-indigo-200"
            @click="onRestart"
          >
            Study
          </CommonButton>
          again.
        </p>
      </div>
    </template>

    <div v-else class="mt-4">
      No cards to study (for now). Check again later.
    </div>
  </div>
</template>

<style scoped>
._card {
  height: min(24rem, 56vh);
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
