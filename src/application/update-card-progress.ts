import type { Card } from "@/domain/card";
import type { Stat } from "@/domain/stat";
import { updateStatApi } from "@/services/api/stats/update-idb";
import { notificationService } from "@/services/index";

//#region types
export type UpdateStatApi = (args: {
  cardId: Card["id"];
  status: "success" | "failure" | "skip";
}) => Promise<Stat>;

export type UpdateCardProgressUC = UpdateStatApi;
//#endregion

export const updateCardProgressUC: UpdateCardProgressUC = async ({ cardId, status }) => {
  try {
    const updatedStat = await updateStatApi({ cardId, status });
    notificationService.notify("stat updated");
    return updatedStat;
  } catch (error) {
    notificationService.error(error);
    throw error;
  }
};
