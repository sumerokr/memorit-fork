import type { UpdateCardSetUC } from "@/application/ports";
import { updateCardSet as _updateCardSet } from "@/domain/card-set";
import {
  cardSetAPI,
  cardSetStorage,
  notificationService,
} from "@/services/index";

export const updateCardSet: UpdateCardSetUC = async (cardSet) => {
  const _cardSet = cardSetStorage.getById(cardSet.id);
  if (!_cardSet) {
    return;
  }
  const updatedCardSet = _updateCardSet(cardSet);

  try {
    await cardSetAPI.update(updatedCardSet);
    cardSetStorage.update(updatedCardSet);
    notificationService.notify("updated");
  } catch (error) {
    const message = (() => {
      return error instanceof Error ? error.message : "unknown error";
    })();
    notificationService.notify(message);
  }
};
