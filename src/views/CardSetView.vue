<script setup lang="ts">
import { ref } from "vue";
import { useAsyncState, onClickOutside } from "@vueuse/core";
import { useRouter } from "vue-router";
import { getCardSetUC } from "@/application/get-card-set";
import { deleteCardSetUC } from "@/application/delete-card-set";

type Props = {
  cardSetId: string;
};

const props = defineProps<Props>();

const router = useRouter();

const {
  state: cardSet,
  isLoading: isGetCardSetLoading,
  isReady: isGetCardSetReady,
} = useAsyncState(() => getCardSetUC({ id: props.cardSetId }), null);

const { isLoading: isDeleteCardSetLoading, execute: deleteCardSet } =
  useAsyncState(() => deleteCardSetUC({ id: props.cardSetId }), null, {
    immediate: false,
    onSuccess: () => {
      router.replace({ name: "sets" });
    },
  });

const onDelete = async () => {
  await deleteCardSet();
};

const isMenuOpen = ref(false);
const menuRef = ref(null);

onClickOutside(menuRef, () => {
  isMenuOpen.value = false;
});
</script>

<template>
  <div class="flex-grow flex flex-col p-4 bg-neutral-100">
    <p class="mb-4">
      <RouterLink :to="{ name: 'sets' }" class="text-indigo-500"
        ><span class="inline-block rotate-180">➜</span> Back to card
        sets</RouterLink
      >
    </p>

    <div
      v-if="isGetCardSetReady && cardSet"
      class="border rounded-xl p-4 bg-white"
    >
      <div class="flex items-baseline justify-between mb-4">
        <h1 class="text-3xl">{{ cardSet.title }}</h1>
        <div class="relative ml-4" ref="menuRef">
          <button
            class="flex -m-1 p-2 rounded-2xl"
            type="button"
            @click="isMenuOpen = !isMenuOpen"
          >
            <span class="material-symbols-outlined">more_vert</span>
          </button>
          <div v-if="isMenuOpen" class="absolute -top-1 mr-2 right-full flex">
            <button
              class="flex gap-2 px-4 py-2 mr-2 items-center bg-red-100 rounded-2xl justify-center"
              :disabled="isDeleteCardSetLoading"
              @click="onDelete"
            >
              Delete
              <span class="material-symbols-outlined text-xl leading-none">
                delete
              </span>
            </button>
            <RouterLink
              :to="{ name: 'card-set-edit', params: { cardSetId } }"
              class="flex gap-2 px-4 py-2 items-center bg-indigo-100 rounded-2xl justify-center"
            >
              Edit
              <span class="material-symbols-outlined text-xl leading-none">
                edit
              </span>
            </RouterLink>
          </div>
        </div>
      </div>
      <p class="mb-8 flex items-baseline justify-between opacity-60">
        <span>Cards: {{ cardSet.cardsCount }}</span>
        <span
          >To study:
          <span
            class="inline-block px-1 py-0.5 rounded-md"
            :class="
              cardSet.cardsToStudyCount > 0 ? 'bg-amber-300' : 'bg-amber-100'
            "
            >{{ cardSet.cardsToStudyCount }}</span
          ></span
        >
      </p>

      <div class="flex flex-wrap gap-4">
        <RouterLink
          :to="{ name: 'cards', params: { cardSetId: props.cardSetId } }"
          class="flex-grow gap-2 px-4 py-2 items-center bg-indigo-50 rounded-2xl flex justify-center"
        >
          View
          <span class="material-symbols-outlined text-xl leading-none">
            view_agenda
          </span>
        </RouterLink>
        <RouterLink
          :to="{ name: 'new-card', params: { cardSetId: props.cardSetId } }"
          class="flex-grow gap-2 px-4 py-2 items-center bg-indigo-50 rounded-2xl flex justify-center"
        >
          Add
          <span class="material-symbols-outlined text-xl leading-none">
            add
          </span>
        </RouterLink>
        <RouterLink
          :to="{ name: 'study', params: { cardSetId: props.cardSetId } }"
          class="flex-grow gap-2 px-4 py-2 items-center bg-indigo-200 rounded-2xl flex justify-center"
        >
          Study
          <span class="material-symbols-outlined text-xl leading-none"
            >play_arrow</span
          >
        </RouterLink>
      </div>
    </div>

    <div v-else-if="isGetCardSetLoading">Loading...</div>
  </div>
</template>
