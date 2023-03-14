import type { DeleteCardSetUC } from "@/application/ports";
import {
  cardSetAPI,
  cardSetStorage,
  notificationService,
} from "@/services/index";

export const deleteCardSet: DeleteCardSetUC = async (id) => {
  try {
    console.time("cardSetAPI.delete");
    await cardSetAPI.delete(id);
    console.timeEnd("cardSetAPI.delete");
    cardSetStorage.delete(id);
    notificationService.notify("deleted");
  } catch (error) {
    notificationService.error(error);
  }
};
