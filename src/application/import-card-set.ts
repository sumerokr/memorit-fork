import { createCardSet, type CardSet } from "@/domain/card-set";
import { importCardSetApi } from "@/services/api/import-card-set-idb";
import { usersService } from "@/services/users-service";
import { notificationService } from "@/services";
import { type Card, createCard } from "@/domain/card";
import { generateID } from "@/utils";

//#region types
export type ImportCardSetApi = (args: { cardSet: CardSet; cards: Array<Card> }) => Promise<void>;

export type ImportCardSetUC = (args: {
  title: CardSet["title"];
  items: Array<{ front: Card["front"]; back: Card["back"] }>;
}) => Promise<void>;
//#endregion

export const importCardSetUC: ImportCardSetUC = async ({ title, items }) => {
  try {
    const userId = await usersService.getUserId();
    const itemsCount = items.length;

    const cardSet = createCardSet({
      id: generateID(),
      title,
      createdAt: new Date(Date.now() - itemsCount).toISOString(),
      createdBy: userId,
    });

    const cards = items.map(({ front, back }, index) => {
      return createCard({
        id: generateID(),
        front,
        back,
        cardSetId: cardSet.id,
        createdAt: new Date(Date.now() - itemsCount + 1 + index).toISOString(),
        createdBy: userId,
      });
    });

    await importCardSetApi({ cardSet, cards });
    notificationService.notify("card-set imported");
  } catch (error) {
    notificationService.error(error);
    throw error;
  }
};
