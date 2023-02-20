<script setup lang="ts">
import { ref } from "vue";

type Props = {
  cardSetId: string;
};

const props = defineProps<Props>();

const isShown = ref(false);
</script>

<template>
  <div class="flex-grow bg-neutral-100 p-4">
    <p class="mb-4">
      <RouterLink
        :to="{ name: 'set', params: { cardSetId } }"
        class="text-indigo-500"
        ><span class="inline-block rotate-180">➜</span> Back to card
        set</RouterLink
      >
    </p>

    <h1 class="text-2xl mb-4">Play</h1>
    <p class="mb-4 text-sm opacity-60">Progress: 1/20</p>

    <div class="border rounded-xl mb-4 p-4 bg-white">
      <div
        class="grid _grid h-40"
        :class="isShown ? '_grid-show' : '_grid-hide'"
      >
        <p class="flex items-center justify-center">
          <span>Front side</span>
        </p>
        <p class="_back flex items-center justify-center overflow-hidden">
          <span>Back side</span>
        </p>
      </div>
    </div>

    <div v-if="isShown" class="border rounded-xl p-4 bg-white">
      <p class="mb-2 text-sm opacity-60">How well did you know the answer?</p>
      <div class="flex flex-wrap gap-4">
        <button
          type="button"
          class="gap-2 px-4 py-2 items-center flex-1 bg-red-100 rounded-2xl flex justify-center"
        >
          <span class="material-symbols-outlined">
            sentiment_dissatisfied
          </span>
        </button>
        <button
          type="button"
          class="gap-2 px-4 py-2 items-center flex-1 bg-yellow-100 rounded-2xl flex justify-center"
        >
          <span class="material-symbols-outlined"> sentiment_neutral </span>
        </button>
        <button
          type="button"
          class="gap-2 px-4 py-2 items-center flex-1 bg-green-100 rounded-2xl flex justify-center"
        >
          <span class="material-symbols-outlined"> sentiment_satisfied </span>
        </button>
      </div>
    </div>

    <div v-else class="border rounded-xl p-4 bg-white">
      <p class="mb-2 text-sm opacity-60">
        Do you remember the card? Let's find out
      </p>
      <div class="flex">
        <button
          type="button"
          class="gap-2 px-4 py-2 items-center flex-1 bg-indigo-200 rounded-2xl flex justify-center"
          @click="isShown = !isShown"
        >
          Reveal
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
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
</style>
