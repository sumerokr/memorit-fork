import type { Card } from "@/domain/card";
import { getCardApi } from "@/services/api/cards/get-idb";
import { notificationService } from "@/services/index";

//#region types
export type GetCardApi = (args: { id: Card["id"] }) => Promise<Card>;

export type GetCardUC = GetCardApi;
//#endregion

export const getCardUC: GetCardUC = async ({ id }) => {
  try {
    const card = await getCardApi({ id });
    notificationService.notify("card received");
    return card;
  } catch (error) {
    notificationService.error(error);
    throw error;
  }
};
