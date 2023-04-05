import type { CardV2 } from "@/domain/card";
import { getCardApi } from "@/services/api/cards/get-idb";
import { notificationService } from "@/services/index";

//#region types
export type GetCardApiParameters = {
  id: CardV2["id"];
};

export type GetCardApiReturn = Promise<CardV2>;

export type GetCardApi = (args: GetCardApiParameters) => GetCardApiReturn;

export type GetCardUC = (args: { id: CardV2["id"] }) => Promise<CardV2>;
//#endregion

export const getCardUC: GetCardUC = async ({ id }) => {
  try {
    const card = await getCardApi({ id });
    notificationService.notify("received");
    return card;
  } catch (error) {
    notificationService.error(error);
    throw error;
  }
};
