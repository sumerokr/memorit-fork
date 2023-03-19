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

export type GetCardSetUC = (args: { id: CardSetV2["id"] }) => Promise<
  CardSetV2 & {
    cardsCount: number;
    cardsToStudyCount: number;
  }
>;
//#endregion

export const getCardSetUC: GetCardSetUC = async ({ id }) => {
  try {
    const cardSet = await getCardSetApi({ id });
    notificationService.notify("received");
    return cardSet;
  } catch (error) {
    notificationService.error(error);
    throw error;
  }
};
