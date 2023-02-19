<script setup lang="ts">
import { ref } from "vue";
import { useRoute } from "vue-router";
import { cardSetsRepository } from "@/services/card-sets-db-local-storage";
import { cardsRepository } from "@/services/cards-db-local-storage";
import type { CardSet } from "@/domain/card-set";

type Props = {
  cardSetId: string;
};

const props = defineProps<Props>();

const route = useRoute();

const cardSet = ref<CardSet | null>(null);
const extra = ref<Record<string, any>>({});

cardSetsRepository.get(props.cardSetId).then((_cardSet) => {
  cardSet.value = _cardSet || null;
});
cardsRepository.getAll().then((cards) => {
  const cardsByCardSetId = cards.filter(
    (card) => card.cardSetId === props.cardSetId
  );
  extra.value.cardsCount = cardsByCardSetId.length;
  extra.value.studied = cardsByCardSetId.filter(
    (card) => card.progress !== 1
  ).length;
  const max = cardsByCardSetId.length * 10;
  extra.value.progress =
    (cardsByCardSetId
      .map((card) => card.progress)
      .reduce<number>((acc, progress) => {
        return acc + progress;
      }, 0) /
      max) *
    100;
});
</script>

<template>
  <div class="bg-neutral-100 flex-grow flex flex-col">
    <div class="p-4">
      <p class="mb-12">
        <RouterLink :to="{ name: 'sets' }" class="text-indigo-500"
          ><span class="inline-block rotate-180">➜</span> Back to card
          sets</RouterLink
        >
      </p>

      <div v-if="cardSet">
        <h1 class="text-4xl mb-12">{{ cardSet.title }}</h1>
        <div class="flex gap-x-4">
          <dl class="basis-1/3">
            <dt class="text-xs opacity-60">Cards studied</dt>
            <dd class="mb-2">{{ extra.studied }}/{{ extra.cardsCount }}</dd>

            <dt class="text-xs opacity-60">Progress</dt>
            <dd>{{ Math.round(extra.progress) }}%</dd>
          </dl>
          <div class="basis-2/3">
            <p class="mb-1.5 text-xs opacity-60">Progress</p>
            <div class="flex h-2">
              <div class="flex-1 bg-neutral-400"></div>
              <div class="flex-1 bg-orange-400"></div>
              <div class="flex-1 bg-yellow-400"></div>
              <div class="flex-1 bg-lime-400"></div>
              <div class="flex-1 bg-green-400"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div if="cardSet" class="flex-grow border-t rounded-2xl bg-white">
      <div class="flex flex-wrap gap-4 p-4">
        <RouterLink
          :to="{ name: 'cards', params: { cardSetId: route.params.cardSetId } }"
          class="flex-auto gap-2 px-4 py-2 items-center bg-indigo-200 rounded-2xl flex justify-center"
        >
          View
          <span class="material-symbols-outlined text-xl leading-none">
            view_agenda
          </span>
        </RouterLink>
        <RouterLink
          :to="{
            name: 'new-card',
            params: { cardSetId: route.params.cardSetId },
          }"
          class="flex-auto gap-2 px-4 py-2 items-center bg-indigo-200 rounded-2xl flex justify-center"
        >
          Add
          <span class="material-symbols-outlined text-xl leading-none">
            add
          </span>
        </RouterLink>
        <button
          class="flex-auto gap-2 px-4 py-2 items-center bg-indigo-400 rounded-2xl flex justify-center"
          type="button"
        >
          Study
          <span class="material-symbols-outlined text-xl leading-none"
            >play_arrow</span
          >
        </button>
      </div>
      <RouterView />
    </div>
  </div>
</template>

<style scoped></style>
