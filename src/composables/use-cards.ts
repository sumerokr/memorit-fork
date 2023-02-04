import { useAsyncState } from "@vueuse/core";
import { createCardUC } from "@/application/create-card";
import { getCardsByCardSetId } from "@/application/get-cards";

export const useCreateCard = () => {
  const { isReady, isLoading, execute } = useAsyncState(createCardUC, null, {
    immediate: false,
  });
  return {
    isReady,
    isLoading,
    execute: ({ front, back, cardSetId }: Parameters<typeof createCardUC>[0]) =>
      execute(0, { front, back, cardSetId }),
  };
};

export const useGetCards = () => {
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
    execute: (cardSetId: Parameters<typeof getCardsByCardSetId>[0]) => {
      execute(0, cardSetId);
    },
  };
};
