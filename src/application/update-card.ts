import type { Card } from "@/domain/card";
import { updateCardApi } from "@/services/api/cards/update-idb";
import { notificationService } from "@/services/index";
import { usersService } from "@/services/users-service";

//#region types
export type UpdateCardApi = (args: {
  id: Card["id"];
  data: Partial<Pick<Card, "front" | "back" | "updatedAt" | "updatedBy">>;
}) => Promise<Card>;

export type UpdateCardUC = UpdateCardApi;
//#endregion

export const updateCardUC: UpdateCardUC = async ({ id, data }) => {
  try {
    const userId = await usersService.getUserId();
    const enhancedData = {
      ...data,
      updatedAt: new Date().toISOString(),
      updatedBy: userId,
    };
    const updatedCard = await updateCardApi({ id, data: enhancedData });
    notificationService.notify("card updated");
    return updatedCard;
  } catch (error) {
    notificationService.error(error);
    throw error;
  }
};
