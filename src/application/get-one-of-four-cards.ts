import type { Card } from "@/domain/card";
import type { Stat } from "@/domain/stat";
import { getOneOfFourCardsApi } from "@/services/api/get-one-of-four-cards-idb";
import { notificationService } from "@/services/index";

//#region types
export type GetOneOfFourCardsApi = (args: { cardSetId: Card["cardSetId"] }) => Promise<
  Array<{
    card: Card;
    stat: Stat | null;
    rest: Array<Card>;
  }>
>;

export type GetOneOfFourCardsUC = GetOneOfFourCardsApi;
//#endregion

export const getOneOfFourCardsUC: GetOneOfFourCardsUC = async ({ cardSetId }) => {
  try {
    const cards = await getOneOfFourCardsApi({ cardSetId });
    notificationService.notify("one of four cards received");
    return cards;
  } catch (error) {
    notificationService.error(error);
    throw error;
  }
};
