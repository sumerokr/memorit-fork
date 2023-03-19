import type { CardSetV2 } from "@/domain/card-set";
import { updateCardSetApi } from "@/services/api/card-sets/update-idb";
import { notificationService } from "@/services/index";

//#region types
export type UpdateCardSetApiParameters = {
  id: CardSetV2["id"];
  data: Partial<Pick<CardSetV2, "title" | "updatedAt" | "updatedBy">>;
};

export type UpdateCardSetApiReturn = Promise<void>;

export type UpdateCardSetApi = (
  args: UpdateCardSetApiParameters
) => UpdateCardSetApiReturn;

type UpdateCardSetParameters = {
  id: CardSetV2["id"];
  data: Partial<Pick<CardSetV2, "title" | "updatedAt" | "updatedBy">>;
};

export type UpdateCardSetUC = (
  args: UpdateCardSetParameters
) => Promise<Partial<Pick<CardSetV2, "title" | "updatedAt" | "updatedBy">>>;
//#endregion

export const updateCardSetUC: UpdateCardSetUC = async ({ id, data }) => {
  try {
    await updateCardSetApi({ id, data });
    notificationService.notify("updated");
    return data;
  } catch (error) {
    notificationService.error(error);
    throw error;
  }
};
