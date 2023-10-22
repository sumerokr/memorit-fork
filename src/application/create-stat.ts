import { type Stat, createStat } from "@/domain/stat";
import { createStatApi } from "@/services/api/stats/create-idb";
import { usersService } from "@/services/users-service";
import { notificationService } from "@/services/index";

//#region types
export type CreateStatApi = (args: { stat: Stat }) => Promise<Stat>;

export type CreateStatUC = (args: {
  cardId: Stat["cardId"];
  status: Stat["progress"];
}) => Promise<Stat>;
//#endregion

export const createStatUC: CreateStatUC = async ({ cardId, status }) => {
  try {
    const userId = await usersService.getUserId();
    const stat = createStat({
      id: crypto.randomUUID(),
      cardId,
      userId,
      createdAt: new Date().toISOString(),
      progress,
    });
    await createStatApi({ stat });
    notificationService.notify("stat created");
    return stat;
  } catch (error) {
    notificationService.error(error);
    throw error;
  }
};
