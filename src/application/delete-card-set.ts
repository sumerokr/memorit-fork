import type { CardSetV2 } from "@/domain/card-set";
import { deleteCardSetApi } from "@/services/api/card-sets/delete-idb";
import { notificationService } from "@/services/index";

//#region types
export type DeleteCardSetApiParameters = {
  id: CardSetV2["id"];
};

export type DeleteCardSetApiReturn = Promise<void>;

export type DeleteCardSetApi = (
  args: DeleteCardSetApiParameters
) => DeleteCardSetApiReturn;

type DeleteCardSetParameters = {
  id: CardSetV2["id"];
};

export type DeleteCardSetUC = (args: DeleteCardSetParameters) => Promise<void>;
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
