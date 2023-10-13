import type { CardSet } from "@/domain/card-set";
import { updateCardSetApi } from "@/services/api/card-sets/update-idb";
import { notificationService } from "@/services/index";

//#region types
//#region API type
export type UpdateCardSetApiParameters = {
  id: CardSet["id"];
  data: Partial<Pick<CardSet, "title" | "updatedAt" | "updatedBy">>;
};

export type UpdateCardSetApiReturn = Promise<CardSet>;

export type UpdateCardSetApi = (
  args: UpdateCardSetApiParameters
) => UpdateCardSetApiReturn;
//#endregion

//#region UC type
type UpdateCardSetParameters = {
  id: CardSet["id"];
  data: Partial<Pick<CardSet, "title" | "updatedAt" | "updatedBy">>;
};

export type UpdateCardSetUC = (
  args: UpdateCardSetParameters
) => Promise<CardSet>;
//#endregion
//#endregion

export const updateCardSetUC: UpdateCardSetUC = async ({ id, data }) => {
  try {
    const cardSet = await updateCardSetApi({ id, data });
    notificationService.notify("updated");
    return cardSet;
  } catch (error) {
    notificationService.error(error);
    throw error;
  }
};
