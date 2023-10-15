import type { CardSet } from "@/domain/card-set";
import { updateCardSetApi } from "@/services/api/card-sets/update-idb";
import { notificationService } from "@/services/index";

//#region types
export type UpdateCardSetApi = (args: {
  id: CardSet["id"];
  data: Partial<Pick<CardSet, "title" | "updatedAt" | "updatedBy">>;
}) => Promise<CardSet>;

export type UpdateCardSetUC = (args: {
  id: CardSet["id"];
  data: Partial<Pick<CardSet, "title" | "updatedAt" | "updatedBy">>;
}) => Promise<CardSet>;
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
