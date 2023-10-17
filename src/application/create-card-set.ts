import { createCardSet, type CardSet } from "@/domain/card-set";
import { createCardSetApi } from "@/services/api/card-sets/create-idb";
import { usersService } from "@/services/users-service";
import { notificationService } from "@/services";

//#region types
export type CreateCardSetApi = (args: { cardSet: CardSet }) => Promise<CardSet>;

export type CreateCardSetUC = (args: {
  title: CardSet["title"];
}) => Promise<CardSet>;
//#endregion

export const createCardSetUC: CreateCardSetUC = async ({ title }) => {
  try {
    const userId = await usersService.getUserId();
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
