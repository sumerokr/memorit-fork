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

export type UpdateCardSetUC = (args: UpdateCardSetParameters) => Promise<void>;

type SetupUpdateCardSetUC = (args: {
  onSucces: (
    data: Partial<Pick<CardSetV2, "title" | "updatedAt" | "updatedBy">>
  ) => void;
  onError?: (error: unknown) => void;
}) => UpdateCardSetUC;
//#endregion

export const setupUpdateCardSetUC: SetupUpdateCardSetUC =
  ({ onSucces, onError }) =>
  async ({ id, data }) => {
    try {
      await updateCardSetApi({ id, data });
      onSucces(data);
      notificationService.notify("updated");
    } catch (error) {
      onError?.(error);
      notificationService.error(error);
    }
  };
