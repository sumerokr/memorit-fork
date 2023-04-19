import type { CardV2 } from "@/domain/card";
import { getAllCardsApi } from "@/services/api/cards/get-all-idb";
import { notificationService } from "@/services/index";

//#region types
export type GetCardsApiParameters = {
  cardSetId: CardV2["cardSetId"];
  query?: CardV2["front"] | CardV2["back"];
} & (
  | {
      before: CardV2["id"];
      after?: never;
    }
  | {
      before?: never;
      after: CardV2["id"];
    }
  | {
      before?: never;
      after?: never;
    }
);

export type GetCardsApiReturn = Promise<{
  data: CardV2[];
  before?: CardV2["id"];
  after?: CardV2["id"];
}>;

export type GetCardsApi = (args?: GetCardsApiParameters) => GetCardsApiReturn;

export type GetCardsUC = (
  args: {
    cardSetId: CardV2["cardSetId"];
    query?: CardV2["front"] | CardV2["back"];
  } & (
    | {
        before: CardV2["id"];
        after?: never;
      }
    | {
        before?: never;
        after: CardV2["id"];
      }
    | {
        before?: never;
        after?: never;
      }
  )
) => Promise<{
  data: CardV2[];
  before?: CardV2["id"];
  after?: CardV2["id"];
}>;
//#endregion

export const getCardsUC: GetCardsUC = async (args) => {
  try {
    const cards = await getAllCardsApi(args);
    notificationService.notify("received");
    return cards;
  } catch (error) {
    notificationService.error(error);
    throw error;
  }
};
