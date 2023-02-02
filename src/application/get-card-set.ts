import type { GetCardSetByIdUC } from "@/application/ports";
import type { CardSet } from "@/domain/card-set";
import {
  cardSetAPI,
  cardSetStorage,
  notificationService,
} from "@/services/index";

export const getCardSetById: GetCardSetByIdUC = async (id: CardSet["id"]) => {
  try {
    const cardSet = await cardSetAPI.getById(id);
    cardSetStorage.save(cardSet);
    notificationService.notify("received");
  } catch (error) {
    const message = (() => {
      return error instanceof Error ? error.message : "unknown error";
    })();
    notificationService.notify(message);
  }
};
