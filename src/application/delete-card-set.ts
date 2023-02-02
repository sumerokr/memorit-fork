import type { DeleteCardSetUC } from "@/application/ports";
import {
  cardSetAPI,
  cardSetStorage,
  notificationService,
} from "@/services/index";

export const deleteCardSet: DeleteCardSetUC = async (id) => {
  try {
    await cardSetAPI.delete(id);
    cardSetStorage.delete(id);
    notificationService.notify("deleted");
  } catch (error) {
    const message = (() => {
      return error instanceof Error ? error.message : "unknown error";
    })();
    notificationService.notify(message);
  }
};
