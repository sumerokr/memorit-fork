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
    const message = (() => {
      return error instanceof Error ? error.message : "unknown error";
    })();
    notificationService.notify(message);
  }
};
