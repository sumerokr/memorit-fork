import { useAsyncState } from "@vueuse/core";
import { createCardUC } from "@/application/create-card";
import { getCardsByCardSetId } from "@/application/get-cards";
import { updateCardStatusUC } from "@/application/update-card-status";

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

export const useGetCardsByCardSetId = () => {
  const { isReady, isLoading, execute } = useAsyncState(
    getCardsByCardSetId,
    null,
    {
      immediate: false,
    }
  );
  return {
    isReady,
    isLoading,
    execute: (...args: Parameters<typeof getCardsByCardSetId>) => {
      return execute(0, ...args);
    },
  };
};

export const useChangeCardStatus = () => {
  const { isReady, isLoading, execute } = useAsyncState(
    updateCardStatusUC,
    null,
    {
      immediate: false,
    }
  );
  return {
    isReady,
    isLoading,
    execute: async ({
      id,
      progress,
    }: Parameters<typeof updateCardStatusUC>[0]) => {
      return execute(0, {
        id,
        progress,
      });
    },
  };
};
