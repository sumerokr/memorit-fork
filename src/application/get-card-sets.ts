import type { CardSet } from "@/domain/card-set";
import { getAllCardSetsApi } from "@/services/api/card-sets/get-all-idb";
import { notificationService } from "@/services/index";

//#region types
export type GetCardSetsApi = () => Promise<
  Array<{
    cardSet: CardSet;
    cardsCount: number;
    cardsToStudyCount: number;
  }>
>;

export type GetCardSetsUC = GetCardSetsApi;
//#endregion

export const getCardSetsUC: GetCardSetsUC = async () => {
  try {
    const cardSets = await getAllCardSetsApi();
    notificationService.notify("card-sets received");
    return cardSets;
  } catch (error) {
    notificationService.error(error);
    throw error;
  }
};
