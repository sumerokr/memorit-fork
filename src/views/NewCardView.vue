<script setup lang="ts">
import { ref } from "vue";
import { RouterLink } from "vue-router";
import type { CardSet } from "@/domain/card-set";
import { cardSetsRepository } from "@/services/card-sets-db-local-storage";

type Props = {
  cardSetId: string;
};

const props = defineProps<Props>();

const cardSet = ref<CardSet | null>(null);
cardSetsRepository.get(props.cardSetId).then((_cardSet) => {
  cardSet.value = _cardSet || null;
});

const front = ref("");
const back = ref("");

const onSubmit = () => {
  front.value = "";
  back.value = "";
  console.log("submitted");
};
</script>

<template>
  <div class="flex-grow bg-neutral-100">
    <div class="p-4">
      <p class="mb-4">
        <RouterLink
          :to="{ name: 'set', params: { cardSetId: props.cardSetId } }"
          class="text-blue-500"
          ><span class="inline-block rotate-180">➜</span> Back to card
          set</RouterLink
        >
      </p>
      <h1 v-if="cardSet" class="text-lg">New card for {{ cardSet.title }}</h1>
      <p v-else>Nothing...</p>
    </div>

    <div v-if="cardSet" class="p-4">
      <form class="border rounded-2xl p-4 bg-white" @submit.prevent="onSubmit">
        <p class="mb-4">
          <label class="text-sm opacity-50" for="front">Card front</label><br />
          <input
            v-model="front"
            id="front"
            class="leading-5 border-2 rounded-2xl p-2 w-full"
            type="text"
            autocomplete="off"
          />
        </p>
        <p class="mb-4">
          <label class="text-sm opacity-50" for="back">Card back</label><br />
          <input
            v-model="back"
            id="back"
            class="leading-5 border-2 rounded-2xl p-2 w-full"
            type="text"
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
    </div>
  </div>
</template>
