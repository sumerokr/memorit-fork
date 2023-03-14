import type { GetCardsByCardSetIdUC } from "@/application/ports";
import { cardsAPI, cardsStorage, notificationService } from "@/services/index";

export const getCardsByCardSetId: GetCardsByCardSetIdUC = async (id) => {
  try {
    console.time("cardsAPI.getAllByCardSetId");
    const cards = await cardsAPI.getAllByCardSetId(id);
    console.timeEnd("cardsAPI.getAllByCardSetId");
    // cardsStorage.set(cards);
    notificationService.notify("received");
  } catch (error) {
    notificationService.error(error);
  }
};
