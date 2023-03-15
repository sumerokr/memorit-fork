import { createCardSet, type CardSetV2 } from "@/domain/card-set";
import { createCardSetApi } from "@/services/api/card-sets/create-idb";
import { notificationService } from "@/services";
import { nanoid } from "nanoid";

//#region types
export type CreateCardSetApiParameters = {
  cardSet: CardSetV2;
};

export type CreateCardSetApiReturn = Promise<void>;

export type CreateCardSetApi = (
  args: CreateCardSetApiParameters
) => CreateCardSetApiReturn;

type CreateCardSetUCParameters = {
  title: CardSetV2["title"];
};

export type CreateCardSetUC = (
  args: CreateCardSetUCParameters
) => Promise<void>;

type SetupCreateCardSetUC = (args: {
  onSucces: (cardSet: CardSetV2) => void;
  onError?: (error: unknown) => void;
}) => CreateCardSetUC;
//#endregion

export const setupCreateCardSetUC: SetupCreateCardSetUC =
  ({ onSucces, onError }) =>
  async ({ title }) => {
    try {
      const cardSet = createCardSet({
        id: nanoid(),
        title,
        createdAt: new Date().toISOString(),
      });
      await createCardSetApi({ cardSet });
      notificationService.notify("created");
      onSucces(cardSet);
    } catch (error) {
      onError?.(error);
      notificationService.error(error);
    }
  };
