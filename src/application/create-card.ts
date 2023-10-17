import { type Card, createCard } from "@/domain/card";
import { createCardApi } from "@/services/api/cards/create-idb";
import { usersService } from "@/services/users-service";
import { notificationService } from "@/services/index";

//#region types
export type CreateCardApi = (args: { card: Card }) => Promise<Card>;

export type CreateCardUC = (args: {
  front: Card["front"];
  back: Card["back"];
  cardSetId: Card["cardSetId"];
}) => Promise<Card>;
//#endregion

export const createCardUC: CreateCardUC = async ({
  front,
  back,
  cardSetId,
}) => {
  try {
    const userId = await usersService.getUserId();
    const card = createCard({
      id: crypto.randomUUID(),
      front,
      back,
      cardSetId,
      createdAt: new Date().toISOString(),
      createdBy: userId,
    });
    await createCardApi({ card });
    notificationService.notify("card created");
    return card;
  } catch (error) {
    notificationService.error(error);
    throw error;
  }
};
