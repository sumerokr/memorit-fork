import type { CardSet } from "@/domain/card-set";
import { deleteCardSetApi } from "@/services/api/card-sets/delete-idb";
import { notificationService } from "@/services/index";

//#region types
export type DeleteCardSetApi = (args: { id: CardSet["id"] }) => Promise<void>;

export type DeleteCardSetUC = DeleteCardSetApi;
//#endregion

export const deleteCardSetUC: DeleteCardSetUC = async ({ id }) => {
  try {
    await deleteCardSetApi({ id });
    notificationService.notify("deleted");
  } catch (error) {
    notificationService.error(error);
    throw error;
  }
};
