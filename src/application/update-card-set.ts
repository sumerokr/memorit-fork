import type { UpdateCardSetUC } from "@/application/ports";
import { updateCardSet as _updateCardSet } from "@/domain/card-set";
import {
  cardSetAPI,
  cardSetStorage,
  notificationService,
} from "@/services/index";

export const updateCardSet: UpdateCardSetUC = async (id, data) => {
  try {
    console.time("cardSetAPI.update");
    await cardSetAPI.update(id, data);
    console.timeEnd("cardSetAPI.update");
    cardSetStorage.update(id, data);
    notificationService.notify("updated");
  } catch (error) {
    notificationService.error(error);
  }
};
