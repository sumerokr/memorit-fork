import type { DeleteCardUC } from "@/application/ports";
import { cardsAPI, cardsStorage, notificationService } from "@/services/index";

export const deleteCardUC: DeleteCardUC = async (id) => {
  try {
    console.time("cardsAPI.delete");
    await cardsAPI.delete(id);
    console.timeEnd("cardsAPI.delete");
    cardsStorage.delete(id);
    notificationService.notify("deleted");
  } catch (error) {
    notificationService.error(error);
  }
};
