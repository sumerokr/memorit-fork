import type { GetCardSetsUC } from "@/application/ports";
import {
  cardSetAPI,
  cardSetStorage,
  notificationService,
} from "@/services/index";

export const getCardSets: GetCardSetsUC = async () => {
  try {
    const cardSets = await cardSetAPI.getAll();
    cardSetStorage.set(cardSets);
    notificationService.notify("received");
  } catch (error) {
    const message = (() => {
      return error instanceof Error ? error.message : "unknown error";
    })();
    notificationService.notify(message);
  }
};
