import type { GetCardSetByIdUC } from "@/application/ports";
import type { CardSet } from "@/domain/card-set";
import {
  cardSetAPI,
  cardSetStorage,
  notificationService,
} from "@/services/index";

export const getCardSetByIdUC: GetCardSetByIdUC = async (id: CardSet["id"]) => {
  try {
    console.time("cardSetAPI.getById");
    const cardSet = await cardSetAPI.getById(id);
    console.timeEnd("cardSetAPI.getById");
    cardSetStorage.save(cardSet);
    notificationService.notify("received");
  } catch (error) {
    const message = (() => {
      return error instanceof Error ? error.message : "unknown error";
    })();
    notificationService.notify(message);
  }
};
