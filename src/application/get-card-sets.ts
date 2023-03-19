import type { CardSetV2 } from "@/domain/card-set";
import { getAllCardSetsApi } from "@/services/api/card-sets/get-all-idb";
import { notificationService } from "@/services/index";

//#region types
export type GetCardSetsApiParameters = (
  | {
      before: CardSetV2["id"];
      after?: never;
    }
  | {
      before?: never;
      after: CardSetV2["id"];
    }
  | {
      before?: never;
      after?: never;
    }
) & {
  query?: CardSetV2["title"];
};

export type GetCardSetsApiReturn = Promise<{
  data: (CardSetV2 & {
    cardsCount: number;
    cardsToStudyCount: number;
  })[];
  before?: CardSetV2["id"];
  after?: CardSetV2["id"];
}>;

export type GetCardSetsApi = (
  args?: GetCardSetsApiParameters
) => GetCardSetsApiReturn;

export type GetCardSetsUC = (
  args?: (
    | {
        before: CardSetV2["id"];
        after?: never;
      }
    | {
        before?: never;
        after: CardSetV2["id"];
      }
    | {
        before?: never;
        after?: never;
      }
  ) & {
    query?: CardSetV2["title"];
  }
) => Promise<{
  data: (CardSetV2 & {
    cardsCount: number;
    cardsToStudyCount: number;
  })[];
  before?: CardSetV2["id"];
  after?: CardSetV2["id"];
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
