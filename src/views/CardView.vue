<script setup lang="ts">
import { useAsyncState, refDebounced } from "@vueuse/core";
import { getCardUC } from "@/application/get-card";
import { getCardProgressUC } from "@/application/get-card-progress";
import { updateCardProgressUC } from "@/application/update-card-progress";

type Props = {
  id: string;
};

const props = defineProps<Props>();

const {
  state: card,
  isLoading: isGetCardLoading,
  error: getCardError,
} = useAsyncState(() => getCardUC({ id: props.id }), null);
const isGetCardLoadingDebounced = refDebounced(isGetCardLoading, 3000);

const {
  state: stat,
  isLoading: isGetStatLoading,
  error: getStatError,
  execute: getStatExecute,
} = useAsyncState(() => getCardProgressUC({ cardId: props.id }), null);
const isGetStatLoadingDebounced = refDebounced(isGetStatLoading, 300);

const {
  isLoading: isUpdateStatLoading,
  error: updateStatError,
  execute: updateStatExecute,
} = useAsyncState(updateCardProgressUC, null, {
  immediate: false,
  onSuccess: () => {
    getStatExecute();
  },
});
const isUpdateStatLoadingDebounced = refDebounced(isUpdateStatLoading, 300);
</script>

<template>
  <div class="border p-4">
    <div v-if="isGetCardLoadingDebounced">Loading</div>
    <div v-else-if="getCardError">{{ getCardError }}</div>
    <div v-else-if="card">
      <pre>{{ JSON.stringify(card, null, 2) }}</pre>
      <p class="flex gap-4">
        <button
          class="py-2 px-4 border rounded disabled:opacity-50"
          type="button"
          @click="updateStatExecute(0, { cardId: card.id, status: 'success' })"
          :disabled="isUpdateStatLoadingDebounced"
        >
          +1
        </button>
        <button
          class="py-2 px-4 border rounded disabled:opacity-50"
          type="button"
          @click="updateStatExecute(0, { cardId: card.id, status: 'failure' })"
          :disabled="isUpdateStatLoadingDebounced"
        >
          -1
        </button>
      </p>
      <p v-if="updateStatError">{{ updateStatError }}</p>
    </div>
  </div>

  <hr />

  <div class="border p-4">
    {{ isGetStatLoadingDebounced }}
    <div v-if="isGetStatLoadingDebounced">Loading</div>
    <div v-else-if="getStatError">{{ getStatError }}</div>
    <div v-else-if="stat">
      <pre>{{ JSON.stringify(stat, null, 2) }}</pre>
    </div>
  </div>
</template>
