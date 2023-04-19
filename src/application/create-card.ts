import { type CardV2, createCard } from "@/domain/card";
import { createCardApi } from "@/services/api/cards/create-idb";
import { notificationService } from "@/services/index";
import { nanoid } from "nanoid";

//#region types
export type CreateCardApiParameters = {
  card: CardV2;
};

export type CreateCardApiReturn = Promise<void>;

export type CreateCardApi = (
  args: CreateCardApiParameters
) => CreateCardApiReturn;

type CreateCardUCParameters = {
  front: CardV2["front"];
  back: CardV2["back"];
  cardSetId: CardV2["cardSetId"];
};

export type CreateCardUC = (args: CreateCardUCParameters) => Promise<CardV2>;
//#endregion

export const createCardUC: CreateCardUC = async ({
  front,
  back,
  cardSetId,
}) => {
  try {
    const card = createCard({
      id: nanoid(),
      front,
      back,
      cardSetId,
      createdAt: new Date().toISOString(),
      createdBy: "",
    });
    await createCardApi({ card });
    notificationService.notify("card saved");
    return card;
  } catch (error) {
    notificationService.error(error);
    throw error;
  }
};
