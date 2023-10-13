import { createCardSet, type CardSet } from "@/domain/card-set";
import { createCardSetApi } from "@/services/api/card-sets/create-idb";
import { usersService } from "@/services/users-service";
import { notificationService } from "@/services";

//#region types
//#region API type
export type CreateCardSetApiParameters = {
  cardSet: CardSet;
};

export type CreateCardSetApiReturn = Promise<CardSet>;

export type CreateCardSetApi = (
  args: CreateCardSetApiParameters
) => CreateCardSetApiReturn;
//#endregion

//#region UC type
type CreateCardSetUCParameters = {
  title: CardSet["title"];
};

export type CreateCardSetUC = (
  args: CreateCardSetUCParameters
) => Promise<CardSet>;
//#endregion
//#endregion

export const createCardSetUC: CreateCardSetUC = async ({ title }) => {
  const userId = await usersService.getUserId();
  try {
    const cardSet = createCardSet({
      id: crypto.randomUUID(),
      title,
      createdAt: new Date().toISOString(),
      createdBy: userId,
    });
    await createCardSetApi({ cardSet });
    notificationService.notify("card-set created");
    return cardSet;
  } catch (error) {
    notificationService.error(error);
    throw error;
  }
};
