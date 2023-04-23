import type { CardV2 } from "@/domain/card";
import { updateCardApi } from "@/services/api/cards/update-idb";
import { notificationService } from "@/services/index";

//#region types
export type UpdateCardApiParameters = {
  id: CardV2["id"];
  data: Partial<Pick<CardV2, "front" | "back" | "progress">>;
};

export type UpdateCardApiReturn = Promise<void>;

export type UpdateCardApi = (
  args: UpdateCardApiParameters
) => UpdateCardApiReturn;

type UpdateCardUCParameters = {
  id: CardV2["id"];
  data: Partial<Pick<CardV2, "front" | "back" | "progress">>;
};

export type UpdateCardUC = (args: UpdateCardUCParameters) => Promise<void>;
//#endregion

export const updateCardUC: UpdateCardUC = async ({ id, data }) => {
  try {
    await updateCardApi({ id, data });
    notificationService.notify("updated");
  } catch (error) {
    notificationService.error(error);
    throw error;
  }
};
