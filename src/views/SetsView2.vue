<script setup lang="ts">
import { ref, nextTick } from "vue";
import { useAsyncState, watchDebounced } from "@vueuse/core";
import { cardSetAPI } from "@/services/index";
import CardSetList from "@/components/CardSetList.vue";
import BaseButton from "@/components/BaseButton.vue";

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

//#region pager
const onPrev = () => {
  if (!state.value?.before) return;
  execute(0, {
    before: state.value?.before,
    ...(query.value ? { query: query.value } : {}),
  });
  scrollToTop();
};

const onNext = () => {
  if (!state.value?.after) return;
  execute(0, {
    after: state.value?.after,
    ...(query.value ? { query: query.value } : {}),
  });
  scrollToTop();
};
//#endregion

//#region search
const isSearchVisible = ref(false);
const queryEl = ref<HTMLInputElement | null>(null);
const query = ref(null);
watchDebounced(
  query,
  () => {
    execute(0, query.value ? { query: query.value } : null);
  },
  { debounce: 500 }
);

const onSearch = async () => {
  if (isSearchVisible.value) {
    query.value = null;
    isSearchVisible.value = false;
  } else {
    isSearchVisible.value = true;
    await nextTick();
    queryEl.value?.focus();
  }
};
//#endregion
</script>

<template>
  <div class="flex-grow bg-neutral-100 p-4 pb-24">
    <div class="flex justify-between gap-4 mb-4">
      <h1 class="text-2xl">Card sets</h1>
      <div class="relative">
        <BaseButton
          before="search"
          class="relative z-20 -my-1 !pr-4 align-top"
          @click="onSearch"
        ></BaseButton>
        <input
          v-if="isSearchVisible"
          v-model="query"
          ref="queryEl"
          class="absolute z-10 -top-1 right-0 leading-5 border-2 rounded-2xl p-2 pr-16 w-56"
          type="text"
        />
      </div>
    </div>
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
        <BaseButton
          before="chevron_left"
          :disabled="!state.before"
          @click="onPrev"
          >prev</BaseButton
        >

        <BaseButton
          after="chevron_right"
          :disabled="!state.after"
          @click="onNext"
          >next</BaseButton
        >
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
