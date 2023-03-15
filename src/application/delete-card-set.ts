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

type SetupDeleteCardSetUC = (args: {
  onSucces: () => void;
  onError?: (error: unknown) => void;
}) => DeleteCardSetUC;
//#endregion

export const setupDeleteCardSetUC: SetupDeleteCardSetUC =
  ({ onSucces, onError }) =>
  async ({ id }) => {
    try {
      await deleteCardSetApi({ id });
      onSucces();
      notificationService.notify("deleted");
    } catch (error) {
      onError?.(error);
      notificationService.error(error);
    }
  };
