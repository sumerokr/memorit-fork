import type { Card } from "@/domain/card";
import type { Stat } from "@/domain/stat";
import { getStatApi } from "@/services/api/stats/get-idb";
import { notificationService } from "@/services/index";

//#region types
export type GetStatApi = (args: { cardId: Card["id"] }) => Promise<Stat>;

export type GetCardProgressUC = GetStatApi;
//#endregion

export const getCardProgressUC: GetCardProgressUC = async ({ cardId }) => {
  try {
    const stat = await getStatApi({ cardId });
    notificationService.notify("stat received");
    return stat;
  } catch (error) {
    notificationService.error(error);
    throw error;
  }
};
