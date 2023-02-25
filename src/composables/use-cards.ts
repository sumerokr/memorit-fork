import { ref } from "vue";
import type { Card } from "@/domain/card";
import { useAsyncState } from "@vueuse/core";
import without from "lodash/without";
import { createCardUC } from "@/application/create-card";
import { getCardsByCardSetId } from "@/application/get-cards";
import { getStudyCardsUC } from "@/application/get-study-cards";
import { updateCardStatusUC } from "@/application/update-card-status";
import { getCardByIdUC } from "@/application/get-card";
import { updateCardUC } from "@/application/update-card";

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

export const useUpdateCardStatus = () => {
  const { isReady, isLoading, execute } = useAsyncState(
    updateCardStatusUC,
    null,
    {
      immediate: false,
    }
  );
  const updatingIds = ref<Card["id"][]>([]);

  return {
    isReady,
    isLoading,
    updatingIds,
    execute: async (...args: Parameters<typeof updateCardStatusUC>) => {
      updatingIds.value.push(args[0].id);
      const promise = execute(0, ...args);
      promise.then(() => {
        updatingIds.value = without(updatingIds.value, args[0].id);
      });
      return promise;
    },
  };
};

export const useUpdateCard = () => {
  const { isReady, isLoading, execute } = useAsyncState(updateCardUC, null, {
    immediate: false,
  });
  const updatingIds = ref<Card["id"][]>([]);

  return {
    isReady,
    isLoading,
    updatingIds,
    execute: async (...args: Parameters<typeof updateCardUC>) => {
      updatingIds.value.push(args[0]);
      const promise = execute(0, ...args);
      promise.then(() => {
        updatingIds.value = without(updatingIds.value, args[0]);
      });
      return promise;
    },
  };
};

export const useGetCard = () => {
  const { isReady, isLoading, execute } = useAsyncState(getCardByIdUC, null, {
    immediate: false,
  });
  const gettingIds = ref<Card["id"][]>([]);

  return {
    isReady,
    isLoading,
    gettingIds,
    execute: async (...args: Parameters<typeof getCardByIdUC>) => {
      gettingIds.value.push(args[0]);
      const promise = execute(0, ...args);
      promise.then(() => {
        gettingIds.value = without(gettingIds.value, args[0]);
      });
      return promise;
    },
  };
};
