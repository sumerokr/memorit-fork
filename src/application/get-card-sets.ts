import type { CardSet } from "@/domain/card-set";
import { getAllCardSetsApi } from "@/services/api/card-sets/get-all-idb";
import { notificationService } from "@/services/index";

//#region types
export type GetCardSetsApi = (
  args?: (
    | {
        before: CardSet["id"];
        after?: never;
      }
    | {
        before?: never;
        after: CardSet["id"];
      }
    | {
        before?: never;
        after?: never;
      }
  ) & {
    query?: CardSet["title"];
  }
) => Promise<{
  data: Array<
    CardSet & {
      cardsCount: number;
      cardsToStudyCount: number;
    }
  >;
  before?: CardSet["id"];
  after?: CardSet["id"];
}>;

export type GetCardSetsUC = (
  args?: (
    | {
        before: CardSet["id"];
        after?: never;
      }
    | {
        before?: never;
        after: CardSet["id"];
      }
    | {
        before?: never;
        after?: never;
      }
  ) & {
    query?: CardSet["title"];
  }
) => Promise<{
  data: Array<
    CardSet & {
      cardsCount: number;
      cardsToStudyCount: number;
    }
  >;
  before?: CardSet["id"];
  after?: CardSet["id"];
}>;
//#endregion

export const getCardSetsUC: GetCardSetsUC = async (args) => {
  try {
    const cardSets = await getAllCardSetsApi(args);
    notificationService.notify("received");
    return cardSets;
  } catch (error) {
    notificationService.error(error);
    throw error;
  }
};
