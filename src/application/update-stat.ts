import type { Card } from "@/domain/card";
import { updateStat, type Stat } from "@/domain/stat";
import { updateStatApi } from "@/services/api/stats/update-idb";
import { notificationService } from "@/services/index";
import { usersService } from "@/services/users-service";

//#region types
export type UpdateStatApi = (args: {
  cardId: Card["id"];
  status: "success" | "failure" | "skip";
}) => Promise<Stat>;

export type UpdateStatUC = (args: {
  cardId: Card["id"];
  status: "success" | "failure" | "skip";
}) => Promise<Stat>;
//#endregion

export const updateStatUC: UpdateStatUC = async ({ cardId, status }) => {
  try {
    const updatedStat = updateStat({
      stat,
      data: {
        updatedAt: new Date().toISOString(),
        progress: data.progress,
      },
    });
    const updatedCard = await updateCardApi({ id, data: enhancedData });
    notificationService.notify("card updated");
    return updatedCard;
  } catch (error) {
    notificationService.error(error);
    throw error;
  }
};
