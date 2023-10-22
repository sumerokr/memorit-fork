<script setup lang="ts">
import { useAsyncState } from "@vueuse/core";
import { getDBInstance } from "@/services/idb-storage";
import { createStat, updateStat } from "@/domain/stat";

type Props = {
  id: string;
};

const props = defineProps<Props>();

const {
  state: card,
  isLoading: isGetCardLoading,
  error: getCardError,
} = useAsyncState(async () => {
  const db = await getDBInstance();
  const card = await db.get("cards", props.id);
  return card;
}, null);

const {
  state: stat,
  isLoading: isGetStatLoading,
  error: getStatError,
  execute: getStatExecute,
} = useAsyncState(async () => {
  const db = await getDBInstance();
  const stat = await db.getFromIndex("stats", "cardId", props.id);
  return stat;
}, null);

const {
  isLoading: isUpdateStatLoading,
  error: updateStatError,
  execute: updateStatExecute,
} = useAsyncState(
  async (status: "success" | "failure" | "skip") => {
    const db = await getDBInstance();
    const tx = db.transaction("stats", "readwrite");
    const stat = await tx.store.index("cardId").get(props.id);

    if (!stat) {
      const createdStat = createStat({
        id: crypto.randomUUID(),
        cardId: props.id,
        userId: "local-user",
        status,
        createdAt: new Date().toISOString(),
      });

      await tx.store.put(createdStat);
      return;
    }

    const updatedStat = updateStat({
      stat,
      data: {
        status,
        updatedAt: new Date().toISOString(),
      },
    });

    await tx.store.put(updatedStat);
  },
  null,
  {
    immediate: false,
    onSuccess: () => {
      getStatExecute();
    },
  }
);
</script>

<template>
  <div class="border p-4">
    <div v-if="isGetCardLoading">Loading</div>
    <div v-else-if="getCardError">{{ getCardError }}</div>
    <div v-else-if="card">
      <pre>{{ JSON.stringify(card, null, 2) }}</pre>
      <p>
        <button
          type="button"
          @click="updateStatExecute(0, 'success')"
          :disabled="isUpdateStatLoading"
        >
          +1
        </button>
        <button
          type="button"
          @click="updateStatExecute(0, 'failure')"
          :disabled="isUpdateStatLoading"
        >
          -1
        </button>
      </p>
      <p v-if="updateStatError">{{ updateStatError }}</p>
    </div>
  </div>

  <hr />

  <div class="border p-4">
    <div v-if="isGetStatLoading">Loading</div>
    <div v-else-if="getStatError">{{ getStatError }}</div>
    <div v-else-if="stat">
      <pre>{{ JSON.stringify(stat, null, 2) }}</pre>
    </div>
  </div>
</template>
