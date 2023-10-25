import type { CardSet } from "@/domain/card-set";
import { getCardSetApi } from "@/services/api/card-sets/get-idb";
import { notificationService } from "@/services/index";

//#region types
export type GetCardSetApi = (args: { id: CardSet["id"] }) => Promise<{
  cardSet: CardSet;
  cardsCount: number;
  cardsToStudyCount: number;
}>;

export type GetCardSetUC = GetCardSetApi;
//#endregion

export const getCardSetUC: GetCardSetUC = async ({ id }) => {
  try {
    const cardSet = await getCardSetApi({ id });
    notificationService.notify("card-set received");
    return cardSet;
  } catch (error) {
    notificationService.error(error);
    throw error;
  }
};
