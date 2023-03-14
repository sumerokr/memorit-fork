import type { GetStudyCardsUC } from "@/application/ports";
import { cardsAPI, cardsStorage, notificationService } from "@/services/index";

export const getStudyCardsUC: GetStudyCardsUC = async (id) => {
  try {
    console.time("cardsAPI.getStudyCards");
    const cards = await cardsAPI.getStudyCards(id);
    console.timeEnd("cardsAPI.getStudyCards");
    cardsStorage.set(cards);
    notificationService.notify("received");
  } catch (error) {
    notificationService.error(error);
  }
};
