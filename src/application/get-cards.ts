import type { GetCardsByCardSetIdUC } from "@/application/ports";
import { cardsAPI, cardsStorage, notificationService } from "@/services/index";

export const getCardsByCardSetId: GetCardsByCardSetIdUC = async (id) => {
  try {
    const cards = await cardsAPI.getAllByCardSetId(id);
    cardsStorage.setByCardSetId({ cardSetId: id, cards });
    notificationService.notify("received");
  } catch (error) {
    const message = (() => {
      return error instanceof Error ? error.message : "unknown error";
    })();
    notificationService.notify(message);
  }
};
