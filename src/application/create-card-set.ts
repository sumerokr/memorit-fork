import { createCardSet, type CardSetV2 } from "@/domain/card-set";
import { notificationService } from "@/services";
import { createCardSetIdb } from "@/services/api/card-sets/create-idb";
import { nanoid } from "nanoid";

export type apiCreateCardSetParameters = {
  cardSet: CardSetV2;
};

export type apiCreateCardSetReturn = Promise<void>;

export type apiCreateCardSet = (
  args: apiCreateCardSetParameters
) => apiCreateCardSetReturn;

export type CreateCardSetUC = (title: CardSetV2["title"]) => Promise<void>;

type SetupCreateCardSetUC = (args: {
  onSucces: (cardSet: CardSetV2) => void;
  onError?: (error: unknown) => void;
}) => CreateCardSetUC;

export const setupCreateCardSetUC: SetupCreateCardSetUC =
  ({ onSucces, onError }) =>
  async (title) => {
    try {
      const cardSet = createCardSet({
        id: nanoid(),
        title,
        createdAt: new Date().toISOString(),
      });
      await createCardSetIdb({ cardSet });
      notificationService.notify("created");
      onSucces(cardSet);
    } catch (error) {
      onError?.(error);
      notificationService.error(error);
    }
  };
