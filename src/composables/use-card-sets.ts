import { ref } from "vue";
import { useAsyncState } from "@vueuse/core";
import without from "lodash/without";
import type { CardSet } from "@/domain/card-set";
import { createCardSet } from "@/application/create-card-set";
import { getCardSets } from "@/application/get-card-sets";
import { getCardSetById } from "@/application/get-card-set";
import { updateCardSet } from "@/application/update-card-set";
import { deleteCardSet } from "@/application/delete-card-set";

export const useDeleteCardSet = () => {
  const { isReady, isLoading, execute } = useAsyncState(deleteCardSet, null, {
    immediate: false,
  });
  const deletingIds = ref<CardSet["id"][]>([]);
  return {
    deletingIds,
    isReady,
    isLoading,
    execute: async (id: CardSet["id"]) => {
      deletingIds.value.push(id);
      await execute(0, id);
      deletingIds.value = without(deletingIds.value, id);
    },
  };
};

export const useGetCardSets = () => {
  const { isReady, isLoading, execute } = useAsyncState(getCardSets, null, {
    immediate: false,
  });
  return {
    isReady,
    isLoading,
    execute,
  };
};

export const useGetCardSetById = () => {
  const { isReady, isLoading, execute } = useAsyncState(getCardSetById, null, {
    immediate: false,
  });

  const gettingIds = ref<CardSet["id"][]>([]);
  return {
    gettingIds,
    isReady,
    isLoading,
    execute: async (id: CardSet["id"]) => {
      gettingIds.value.push(id);
      await execute(0, id);
      gettingIds.value = without(gettingIds.value, id);
    },
  };
};

export const useCreateCardSet = () => {
  const { isReady, isLoading, execute } = useAsyncState(createCardSet, null, {
    immediate: false,
  });
  return {
    isReady,
    isLoading,
    execute: (...args: Parameters<typeof createCardSet>) => execute(0, ...args),
  };
};

export const useUpdateCardSet = () => {
  const { isReady, isLoading, execute } = useAsyncState(updateCardSet, null, {
    immediate: false,
  });

  const updateIds = ref<CardSet["id"][]>([]);
  return {
    updateIds,
    isReady,
    isLoading,
    execute: async (cardSet: CardSet) => {
      updateIds.value.push(cardSet.id);
      await execute(0, cardSet);
      updateIds.value = without(updateIds.value, cardSet.id);
    },
  };
};
