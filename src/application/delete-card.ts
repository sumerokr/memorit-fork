import type { CardV2 } from "@/domain/card";
import { deleteCardApi } from "@/services/api/cards/delete-idb";
import { notificationService } from "@/services/index";

//#region types
export type DeleteCardApiParameters = {
  id: CardV2["id"];
};

export type DeleteCardApiReturn = Promise<void>;

export type DeleteCardApi = (
  args: DeleteCardApiParameters
) => DeleteCardApiReturn;

type DeleteCardParameters = {
  id: CardV2["id"];
};

export type DeleteCardUC = (args: DeleteCardParameters) => Promise<void>;
//#endregion

export const deleteCardUC: DeleteCardUC = async ({ id }) => {
  try {
    await deleteCardApi({ id });
    notificationService.notify("deleted");
  } catch (error) {
    notificationService.error(error);
    throw error;
  }
};
