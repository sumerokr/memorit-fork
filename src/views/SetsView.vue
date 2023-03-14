<script setup lang="ts">
import { ref, computed, nextTick, watch } from "vue";
import { useAsyncState, watchDebounced } from "@vueuse/core";
import { cardSetAPI } from "@/services/index";
import CardSetList from "@/components/CardSetList.vue";
import BaseButton from "@/components/BaseButton.vue";
import { useRoute, useRouter } from "vue-router";
import pickBy from "lodash/pickBy";
import pick from "lodash/pick";
import omit from "lodash/omit";
import difference from "lodash/difference";
import mapValues from "lodash/mapValues";

const route = useRoute();
const router = useRouter();

const currentNavigationParams = computed<
  NonNullable<Parameters<(typeof cardSetAPI)["getAll"]>[0]>
>(() => {
  const { before, after, query } = route.query;
  const mapped = mapValues({ before, after, query }, (item) => {
    const itemResolved = Array.isArray(item) ? item[0] : item;
    return itemResolved ? itemResolved.trim() : "";
  });
  const picked = pickBy(mapped, (item) => {
    return item.length > 0;
  });
  return picked.before && picked.after ? omit(picked, "before") : picked;
});

const { /* isReady, isLoading, */ execute, state, error } = useAsyncState(
  cardSetAPI.getAll,
  null,
  {
    immediate: false,
    throwError: true,
    resetOnExecute: false,
  }
);

const queryEl = ref<HTMLInputElement | null>(null);
const query = ref<string>(currentNavigationParams.value.query ?? "");
const isSearchVisible = ref<boolean>(!!query.value);
watchDebounced(
  query,
  (newQuery, oldQuery) => {
    if (newQuery) {
      router.replace({ query: { query: newQuery } });
    } else if (oldQuery) {
      router.replace({ query: omit(route.query, "query") });
    }
  },
  { debounce: 500 }
);

const onSearch = async () => {
  if (isSearchVisible.value) {
    query.value = "";
    isSearchVisible.value = false;
  } else {
    isSearchVisible.value = true;
    await nextTick();
    queryEl.value?.focus();
  }
};

const nextNavigationParams = computed<
  Partial<{ before?: string; after?: string; query?: string }>
>(() => {
  return pickBy(
    {
      query: query.value,
      before: state.value?.before,
      after: state.value?.after,
    },
    (param) => param && param.trim().length > 0
  );
});

watch(
  currentNavigationParams,
  (next, prev) => {
    // do nothing if the only removed parameter was before
    if (!next.before && prev?.before) {
      const nextKeys = Object.keys(next) as (keyof typeof next)[];
      const prevKeys = Object.keys(prev) as (keyof typeof prev)[];
      const addedKeys = difference(nextKeys, prevKeys);
      const removedKeys = difference(prevKeys, nextKeys);
      if (
        removedKeys.length === 1 &&
        removedKeys[0] === "before" &&
        addedKeys.length === 0
      ) {
        return;
      }
    }

    execute(0, currentNavigationParams.value);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  },
  { immediate: true }
);

watch(
  nextNavigationParams,
  (next) => {
    // remove unneeded before parameter if there are no more pages before
    if (!next.before && currentNavigationParams.value.before) {
      router.replace({ query: omit(route.query, "before") });
    }
  },
  { immediate: true }
);
</script>

<template>
  <div class="flex flex-col flex-grow bg-neutral-100 p-4 pb-24">
    <div class="flex justify-between gap-4 mb-4">
      <h1 class="text-2xl">Card sets</h1>
      <div class="relative">
        <BaseButton
          :before="isSearchVisible ? 'close' : 'search'"
          class="relative z-20 -my-1 !pr-4 align-top"
          @click="onSearch"
        ></BaseButton>
        <input
          v-if="isSearchVisible"
          v-model="query"
          @compositionstart="($event) => (($event.target as any).composing = false)"
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
    <template v-if="state?.data.length">
      <CardSetList v-if="state.data.length" :card-sets="state.data" />

      <div
        v-if="state.before || state.after"
        class="flex justify-end gap-4 mt-4"
      >
        <RouterLink
          v-if="state.before"
          :to="{
            name: 'sets',
            query: pick(nextNavigationParams, ['query', 'before']),
          }"
          class="inline-flex gap-2 pr-6 pl-4 py-2 items-center rounded-2xl justify-center bg-indigo-100"
          :disabled="!state.before"
          ><span class="material-symbols-outlined text-xl leading-none"
            >chevron_left</span
          >prev</RouterLink
        >
        <BaseButton v-else before="chevron_left" disabled>prev</BaseButton>

        <RouterLink
          v-if="state.after"
          :to="{
            name: 'sets',
            query: pick(nextNavigationParams, ['query', 'after']),
          }"
          class="inline-flex gap-2 pr-4 pl-6 py-2 items-center rounded-2xl justify-center bg-indigo-100"
          before="chevron_left"
          >prev<span class="material-symbols-outlined text-xl leading-none"
            >chevron_right</span
          ></RouterLink
        >
        <BaseButton v-else after="chevron_right" disabled>next</BaseButton>
      </div>
    </template>

    <div class="my-auto text-center" v-else-if="state && !state.data.length">
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
    </div>

    <RouterLink
      class="fixed right-4 bottom-4 p-4 flex rounded-2xl bg-indigo-200 shadow-md"
      :to="{ name: 'new-card-set' }"
      ><span class="material-symbols-outlined text-2xl leading-none">
        add
      </span></RouterLink
    >
  </div>
</template>
