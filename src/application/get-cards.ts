import type { Card } from "@/domain/card";
import { getAllCardsApi } from "@/services/api/cards/get-all-idb";
import { notificationService } from "@/services/index";

//#region types
export type GetCardsApi = (args: {
  cardSetId: Card["cardSetId"];
}) => Promise<Array<Card>>;

export type GetCardsUC = GetCardsApi;
//#endregion

export const getCardsUC: GetCardsUC = async ({ cardSetId }) => {
  try {
    const cards = await getAllCardsApi({ cardSetId });
    notificationService.notify("cards received");
    return cards;
  } catch (error) {
    notificationService.error(error);
    throw error;
  }
};
