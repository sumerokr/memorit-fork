import type { Card } from "@/domain/card";
import { deleteCardApi } from "@/services/api/cards/delete-idb";
import { notificationService } from "@/services/index";

//#region types
export type DeleteCardApi = (args: { id: Card["id"] }) => Promise<void>;

export type DeleteCardUC = DeleteCardApi;
//#endregion

export const deleteCardUC: DeleteCardUC = async ({ id }) => {
  try {
    await deleteCardApi({ id });
    notificationService.notify("card deleted");
  } catch (error) {
    notificationService.error(error);
    throw error;
  }
};
