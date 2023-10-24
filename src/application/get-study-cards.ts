import type { Card } from "@/domain/card";
import type { Stat } from "@/domain/stat";
import { getStudyCardsApi } from "@/services/api/cards/get-study-idb";
import { notificationService } from "@/services/index";

//#region types
export type GetStudyCardsApi = (args: { cardSetId: Card["cardSetId"] }) => Promise<
  Array<{
    card: Card;
    stat: Stat | null;
  }>
>;

export type GetStudyCardsUC = GetStudyCardsApi;
//#endregion

export const getStudyCardsUC: GetStudyCardsUC = async ({ cardSetId }) => {
  try {
    const cards = await getStudyCardsApi({ cardSetId });
    notificationService.notify("backside cards received");
    return cards;
  } catch (error) {
    notificationService.error(error);
    throw error;
  }
};
