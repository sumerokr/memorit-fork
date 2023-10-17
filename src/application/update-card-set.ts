import type { CardSet } from "@/domain/card-set";
import { updateCardSetApi } from "@/services/api/card-sets/update-idb";
import { notificationService } from "@/services/index";
import { usersService } from "@/services/users-service";

//#region types
export type UpdateCardSetApi = (args: {
  id: CardSet["id"];
  data: Partial<Pick<CardSet, "title" | "updatedAt" | "updatedBy">>;
}) => Promise<CardSet>;

export type UpdateCardSetUC = UpdateCardSetApi;
//#endregion

export const updateCardSetUC: UpdateCardSetUC = async ({ id, data }) => {
  try {
    const userId = await usersService.getUserId();
    const enhancedData = {
      ...data,
      updatedAt: new Date().toISOString(),
      updatedBy: userId,
    };
    const cardSet = await updateCardSetApi({ id, data: enhancedData });
    notificationService.notify("card-set updated");
    return cardSet;
  } catch (error) {
    notificationService.error(error);
    throw error;
  }
};
