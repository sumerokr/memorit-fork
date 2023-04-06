import { ref } from "vue";
import type { Card } from "@/domain/card";
import { useAsyncState } from "@vueuse/core";
import without from "lodash/without";
import { createCardUC } from "@/application/create-card";
import { getStudyCardsUC } from "@/application/get-study-cards";
import { deleteCardUC } from "@/application/delete-card";

export const useCreateCard = () => {
  const { isReady, isLoading, execute } = useAsyncState(createCardUC, null, {
    immediate: false,
  });
  return {
    isReady,
    isLoading,
    execute: (...args: Parameters<typeof createCardUC>) => execute(0, ...args),
  };
};

export const useGetStudyCards = () => {
  const { isReady, isLoading, execute } = useAsyncState(getStudyCardsUC, null, {
    immediate: false,
  });
  return {
    isReady,
    isLoading,
    execute: (...args: Parameters<typeof getStudyCardsUC>) => {
      return execute(0, ...args);
    },
  };
};

export const useDeleteCard = () => {
  const { isReady, isLoading, execute } = useAsyncState(deleteCardUC, null, {
    immediate: false,
  });
  const deletingIds = ref<Card["id"][]>([]);

  return {
    deletingIds,
    isReady,
    isLoading,
    execute: async (id: Card["id"]) => {
      deletingIds.value.push(id);
      await execute(0, id);
      deletingIds.value = without(deletingIds.value, id);
    },
  };
};
