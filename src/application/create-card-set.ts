import { createCardSet, type CardSetV2 } from "@/domain/card-set";
import { createCardSetApi } from "@/services/api/card-sets/create-idb";
import { usersService } from "@/services/users-service";
import { notificationService } from "@/services";
import { nanoid } from "nanoid";

//#region types
export type CreateCardSetApiParameters = {
  cardSet: CardSetV2;
};

export type CreateCardSetApiReturn = Promise<void>;

export type CreateCardSetApi = (
  args: CreateCardSetApiParameters
) => CreateCardSetApiReturn;

type CreateCardSetUCParameters = {
  title: CardSetV2["title"];
};

export type CreateCardSetUC = (
  args: CreateCardSetUCParameters
) => Promise<CardSetV2>;
//#endregion

export const createCardSetUC: CreateCardSetUC = async ({ title }) => {
  const userId = await usersService.getUserId();
  try {
    const cardSet = createCardSet({
      id: nanoid(),
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
