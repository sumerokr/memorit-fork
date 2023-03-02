<script setup lang="ts">
import { useAsyncState } from "@vueuse/core";
import { cardSetAPI } from "@/services/index";
import CardSetList from "@/components/CardSetList.vue";

const { /* isReady, isLoading, */ execute, state, error } = useAsyncState(
  cardSetAPI.getAll,
  null,
  {
    throwError: true,
    resetOnExecute: false,
  }
);

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};

const onPrev = () => {
  if (!state.value?.before) return;
  execute(0, { before: state.value?.before });
  scrollToTop();
};

const onNext = () => {
  if (!state.value?.after) return;
  execute(0, { after: state.value?.after });
  scrollToTop();
};
</script>

<template>
  <div class="flex-grow bg-neutral-100 p-4">
    <h1 class="text-2xl mb-4">Card sets</h1>
    <p
      v-if="error"
      class="mb-4 border border-red-500 rounded-2xl p-4 bg-red-50"
    >
      Error
    </p>
    <template v-if="state">
      <CardSetList v-if="state.data.length" :card-sets="state.data" />
      <div
        v-if="state.before || state.after"
        class="flex justify-end gap-4 mt-4"
      >
        <button
          class="inline-flex gap-2 py-2 pr-6 pl-4 items-center bg-indigo-100 rounded-2xl justify-center disabled:opacity-40"
          :disabled="!state.before"
          @click="onPrev"
        >
          <span class="material-symbols-outlined text-xl leading-none">
            chevron_left
          </span>
          prev
        </button>

        <button
          class="inline-flex gap-2 py-2 pr-4 pl-6 items-center bg-indigo-100 rounded-2xl justify-center disabled:opacity-40"
          :disabled="!state.after"
          @click="onNext"
        >
          next
          <span class="material-symbols-outlined text-xl leading-none">
            chevron_right
          </span>
        </button>
      </div>
    </template>

    <p v-else>
      You have no card sets yet.
      <RouterLink
        :to="{ name: 'new-card-set' }"
        class="gap-2 px-4 py-2 items-center bg-indigo-200 rounded-2xl inline-flex justify-center"
      >
        Create
        <span class="material-symbols-outlined text-xl leading-none">
          add
        </span>
      </RouterLink>
    </p>

    <RouterLink
      class="fixed right-4 bottom-4 p-4 flex rounded-2xl bg-indigo-200 shadow-md"
      :to="{ name: 'new-card-set' }"
      ><span class="material-symbols-outlined text-2xl leading-none">
        add
      </span></RouterLink
    >
  </div>
</template>
