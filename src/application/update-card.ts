import type { UpdateCardUC } from "@/application/ports";
import { cardsAPI, cardsStorage, notificationService } from "@/services/index";

export const updateCardUC: UpdateCardUC = async (id, data) => {
  try {
    console.time("cardsAPI.update");
    await cardsAPI.update(id, data);
    console.timeEnd("cardsAPI.update");
    cardsStorage.update(id, data);
    notificationService.notify("updated");
  } catch (error) {
    notificationService.error(error);
  }
};
