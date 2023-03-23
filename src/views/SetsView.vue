<script setup lang="ts">
import { ref, computed, nextTick, watch } from "vue";
import { useAsyncState, watchDebounced } from "@vueuse/core";
import {
  getCardSetsUC,
  type GetCardSetsApiParameters,
} from "@/application/get-card-sets";
import CardSetList from "@/components/CardSetList.vue";
import CommonButton from "@/components/CommonButton.vue";
import IconButton from "@/components/IconButton.vue";
import { useRoute, useRouter } from "vue-router";
import pickBy from "lodash/pickBy";
import pick from "lodash/pick";
import omit from "lodash/omit";
import difference from "lodash/difference";
import mapValues from "lodash/mapValues";
import RouterLinkCommonButton from "@/components/RouterLinkCommonButton.vue";

const route = useRoute();
const router = useRouter();

const currentNavigationParams = computed<NonNullable<GetCardSetsApiParameters>>(
  () => {
    const { before, after, query } = route.query;
    const mapped = mapValues({ before, after, query }, (item) => {
      const itemResolved = Array.isArray(item) ? item[0] : item;
      return itemResolved ? itemResolved.trim() : "";
    });
    const picked = pickBy(mapped, (item) => {
      return item.length > 0;
    });
    return picked.before && picked.after ? omit(picked, "before") : picked;
  }
);

const {
  execute,
  state: cardSets,
  error,
} = useAsyncState(getCardSetsUC, null, {
  immediate: false,
  resetOnExecute: false,
});

const queryEl = ref<HTMLInputElement | null>(null);
const query = ref<string>(currentNavigationParams.value.query ?? "");
const isSearchVisible = ref<boolean>(!!query.value);
const isSortVisible = ref<boolean>(false);
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
      before: cardSets.value?.before,
      after: cardSets.value?.after,
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
    <div class="flex items-center mb-4">
      <h1 class="text-2xl">Card sets</h1>

      <div class="flex ml-auto -mr-3">
        <div class="relative">
          <IconButton
            :icon="isSearchVisible ? 'close' : 'search'"
            class="relative z-20"
            @click="onSearch"
          ></IconButton>
          <input
            v-if="isSearchVisible"
            v-model="query"
            @compositionstart="($event) => (($event.target as any).composing = false)"
            ref="queryEl"
            class="absolute z-10 top-0 right-0 leading-7 border-2 rounded-2xl p-2 pr-16 w-56"
            type="text"
          />
        </div>

        <div class="relative" hidden>
          <IconButton
            icon="sort"
            class="relative z-10"
            @click="isSortVisible = !isSortVisible"
          ></IconButton>
          <ul
            v-if="isSortVisible"
            class="absolute z-20 top-[100%] right-0 rounded-lg py-2 min-w-[6rem] w-max bg-indigo-50 shadow-md"
          >
            <li class="p-3">
              Date created
              <code
                class="font-mono text-sm -my-1 rounded-md py-1 px-2 bg-neutral-200"
                >new
                <span class="material-symbols-outlined text-xs">
                  arrow_right_alt
                </span>
                old</code
              >
            </li>
            <li class="p-3">
              Date created
              <code
                class="font-mono text-sm -my-1 rounded-md py-1 px-2 bg-neutral-200"
                >old
                <span class="material-symbols-outlined text-xs">
                  arrow_right_alt
                </span>
                new</code
              >
            </li>
            <li class="p-3">
              Alphabetical
              <code
                class="font-mono text-sm -my-1 rounded-md py-1 px-2 bg-neutral-200"
                >A
                <span class="material-symbols-outlined text-xs">
                  arrow_right_alt
                </span>
                Z</code
              >
            </li>
            <li class="p-3">
              Alphabetical
              <code
                class="font-mono text-sm -my-1 rounded-md py-1 px-2 bg-neutral-200"
                >Z
                <span class="material-symbols-outlined text-xs">
                  arrow_right_alt
                </span>
                A</code
              >
            </li>
            <li class="p-3">
              Cards count
              <code
                class="font-mono text-sm -my-1 rounded-md py-1 px-2 bg-neutral-200"
                >low
                <span class="material-symbols-outlined text-xs">
                  arrow_right_alt
                </span>
                high</code
              >
            </li>
            <li class="p-3">
              Cards count
              <code
                class="font-mono text-sm -my-1 rounded-md py-1 px-2 bg-neutral-200"
                >high
                <span class="material-symbols-outlined text-xs">
                  arrow_right_alt
                </span>
                low</code
              >
            </li>
          </ul>
        </div>
      </div>
    </div>

    <p
      v-if="error"
      class="mb-4 border border-red-500 rounded-2xl p-4 bg-red-50"
    >
      Error
    </p>
    <template v-if="cardSets?.data.length">
      <CardSetList v-if="cardSets.data.length" :card-sets="cardSets.data" />

      <div
        v-if="cardSets.before || cardSets.after"
        class="flex justify-end gap-4 mt-4"
      >
        <RouterLinkCommonButton
          v-if="cardSets.before"
          :to="{
            name: 'sets',
            query: pick(nextNavigationParams, ['query', 'before']),
          }"
          before="chevron_left"
          class="bg-indigo-100"
          >prev</RouterLinkCommonButton
        >
        <CommonButton v-else before="chevron_left" disabled>prev</CommonButton>

        <RouterLinkCommonButton
          v-if="cardSets.after"
          :to="{
            name: 'sets',
            query: pick(nextNavigationParams, ['query', 'after']),
          }"
          after="chevron_right"
          class="inline-flex gap-2 pr-4 pl-6 py-2 items-center rounded-2xl justify-center bg-indigo-100"
          >next</RouterLinkCommonButton
        >
        <CommonButton v-else after="chevron_right" disabled>next</CommonButton>
      </div>
    </template>

    <div
      class="my-auto text-center"
      v-else-if="cardSets && !cardSets.data.length"
    >
      You have no card sets yet.
      <RouterLinkCommonButton
        icon="add"
        :to="{ name: 'new-card-set' }"
        class="bg-indigo-200"
      >
        Create
      </RouterLinkCommonButton>
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
