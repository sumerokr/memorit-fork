import type { Card } from "@/domain/card";
import { getAllCardsApi } from "@/services/api/cards/get-all-idb";
import { notificationService } from "@/services/index";

//#region types
export type GetCardsApi = (
  args?: {
    cardSetId: Card["cardSetId"];
    query?: Card["front"] | Card["back"];
  } & (
    | {
        before: Card["id"];
        after?: never;
      }
    | {
        before?: never;
        after: Card["id"];
      }
    | {
        before?: never;
        after?: never;
      }
  )
) => Promise<{
  data: Card[];
  before?: Card["id"];
  after?: Card["id"];
}>;

export type GetCardsUC = GetCardsApi;
//#endregion

export const getCardsUC: GetCardsUC = async (args) => {
  try {
    const cards = await getAllCardsApi(args);
    notificationService.notify("cards received");
    return cards;
  } catch (error) {
    notificationService.error(error);
    throw error;
  }
};
