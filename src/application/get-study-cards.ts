import type { CardV2 } from "@/domain/card";
import { getStudyCardsApi } from "@/services/api/cards/get-study-idb";
import { notificationService } from "@/services/index";

//#region types
export type GetStudyCardsApiParameters = {
  cardSetId: CardV2["cardSetId"];
};

export type GetStudyCardsApiReturn = Promise<CardV2[]>;

export type GetStudyCardsApi = (
  args: GetStudyCardsApiParameters
) => GetStudyCardsApiReturn;

export type GetStudyCardsUC = (args: {
  cardSetId: CardV2["cardSetId"];
}) => Promise<CardV2[]>;
//#endregion

export const getStudyCardsUC: GetStudyCardsUC = async (args) => {
  try {
    const cards = await getStudyCardsApi(args);
    notificationService.notify("received");
    return cards;
  } catch (error) {
    notificationService.error(error);
    throw error;
  }
};
