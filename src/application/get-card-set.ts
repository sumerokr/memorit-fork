import type { CardSetV2 } from "@/domain/card-set";
import { getCardSetApi } from "@/services/api/card-sets/get-idb";
import { notificationService } from "@/services/index";

//#region types
export type GetCardSetApiParameters = {
  id: CardSetV2["id"];
};

export type GetCardSetApiReturn = Promise<
  CardSetV2 & {
    cardsCount: number;
    cardsToStudyCount: number;
  }
>;

export type GetCardSetApi = (
  args: GetCardSetApiParameters
) => GetCardSetApiReturn;

export type GetCardSetUC = (args: { id: CardSetV2["id"] }) => Promise<void>;

type SetupGetCardSetUC = (args: {
  onSucces: (
    cardSet: CardSetV2 & {
      cardsCount: number;
      cardsToStudyCount: number;
    }
  ) => void;
  onError?: (error: unknown) => void;
}) => GetCardSetUC;
//#endregion

export const setupGetCardSetUC: SetupGetCardSetUC =
  ({ onSucces, onError }) =>
  async ({ id }) => {
    try {
      const cardSet = await getCardSetApi({ id });
      onSucces(cardSet);
      notificationService.notify("received");
    } catch (error) {
      onError?.(error);
      notificationService.error(error);
    }
  };
