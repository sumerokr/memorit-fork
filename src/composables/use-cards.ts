import { useAsyncState } from "@vueuse/core";
import { createCardUC } from "@/application/create-card";

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
