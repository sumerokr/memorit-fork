import type { Stat } from "@/domain/stat";
import { getStatApi } from "@/services/api/stats/get-idb";
import { notificationService } from "@/services/index";

//#region types
export type GetStatApi = (args: { cardId: Stat["cardId"] }) => Promise<Stat>;

export type GetStatUC = GetStatApi;
//#endregion

export const getCardUC: GetStatUC = async ({ cardId }) => {
  try {
    const stat = await getStatApi({ cardId });
    notificationService.notify("card updated");
    return stat;
  } catch (error) {
    notificationService.error(error);
    throw error;
  }
};
