import type { UpdateCardStatusUC } from "@/application/ports";
import { updateCardStatus as _updateCardStatus } from "@/domain/card";
import { cardsAPI, cardsStorage, notificationService } from "@/services/index";

export const updateCardStatusUC: UpdateCardStatusUC = async ({
  id,
  progress,
}) => {
  const card = cardsStorage.getById(id);
  if (!card) {
    notificationService.notify("updateCardStatusUC. Card not found");
    return;
  }
  const now = new Date().toISOString();
  const updatedCard = _updateCardStatus({ card, progress, now });

  try {
    await cardsAPI.update(updatedCard);
    cardsStorage.update(updatedCard);
    notificationService.notify("updated");
  } catch (error) {
    const message = (() => {
      return error instanceof Error ? error.message : "unknown error";
    })();
    notificationService.notify(message);
  }
};
