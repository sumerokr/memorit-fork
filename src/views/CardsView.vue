<script setup lang="ts">
import { ref, computed, nextTick, watch } from "vue";
import { useAsyncState, watchDebounced, onClickOutside } from "@vueuse/core";
import {
  getCardsUC,
  type GetCardsApiParameters,
} from "@/application/get-cards";
import CardList from "@/components/CardList.vue";
import CommonButton from "@/components/CommonButton.vue";
import IconButton from "@/components/IconButton.vue";
import { useRoute, useRouter } from "vue-router";
import pickBy from "lodash/pickBy";
import pick from "lodash/pick";
import omit from "lodash/omit";
import difference from "lodash/difference";
import mapValues from "lodash/mapValues";
import RouterLinkCommonButton from "@/components/RouterLinkCommonButton.vue";
import RouterLinkIconButton from "@/components/RouterLinkIconButton.vue";

type Props = {
  cardSetId: string;
};

const props = defineProps<Props>();

const route = useRoute();
const router = useRouter();

const currentNavigationParams = computed<
  NonNullable<Omit<GetCardsApiParameters, "cardSetId">>
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
currentNavigationParams.value.before && currentNavigationParams.value.after;

const {
  execute,
  state: cards,
  error,
} = useAsyncState(getCardsUC, null, {
  immediate: false,
  resetOnExecute: false,
});

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

onClickOutside(queryEl, () => {
  isSearchVisible.value = false;
});

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
      before: cards.value?.before,
      after: cards.value?.after,
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
    // @ts-ignore Omit<> flattens original type
    execute(0, { cardSetId: props.cardSetId, ...next });
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
      <RouterLinkIconButton
        icon="arrow_back"
        class="-ml-3 mr-1"
        :to="{ name: 'set', params: { cardSetId } }"
        >Back</RouterLinkIconButton
      >
      <h1 class="text-2xl">Cards</h1>

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
      </div>
    </div>

    <p
      v-if="error"
      class="mb-4 border border-red-500 rounded-2xl p-4 bg-red-50"
    >
      Error
    </p>
    <template v-if="cards?.data.length">
      <CardList v-if="cards.data.length" :cards="cards.data" />

      <div
        v-if="cards.before || cards.after"
        class="flex justify-end gap-4 mt-4"
      >
        <RouterLinkCommonButton
          v-if="cards.before"
          :to="{
            name: 'cards',
            params: { cardSetId },
            query: pick(nextNavigationParams, ['query', 'before']),
          }"
          before="chevron_left"
          class="bg-indigo-200"
          >prev</RouterLinkCommonButton
        >
        <CommonButton v-else before="chevron_left" disabled>prev</CommonButton>

        <RouterLinkCommonButton
          v-if="cards.after"
          :to="{
            name: 'cards',
            params: { cardSetId },
            query: pick(nextNavigationParams, ['query', 'after']),
          }"
          after="chevron_right"
          class="bg-indigo-200"
          >next</RouterLinkCommonButton
        >
        <CommonButton v-else after="chevron_right" disabled>next</CommonButton>
      </div>
    </template>

    <div class="my-auto text-center" v-else-if="cards && !cards.data.length">
      You have no cards yet.
      <RouterLinkCommonButton
        before="add"
        :to="{ name: 'new-card', params: { cardSetId: cardSetId } }"
        class="bg-indigo-200"
      >
        Create
      </RouterLinkCommonButton>
    </div>

    <RouterLink
      class="fixed right-4 bottom-4 p-4 flex rounded-2xl bg-indigo-500 text-white shadow-md"
      :to="{ name: 'new-card', params: { cardSetId } }"
      ><span class="material-symbols-outlined text-2xl leading-none">
        add
      </span></RouterLink
    >
  </div>
</template>
