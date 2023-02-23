import type { UpdateCardStatusUC } from "@/application/ports";
import { updateProgress } from "@/domain/card";
import { cardsAPI, cardsStorage, notificationService } from "@/services/index";

export const updateCardStatusUC: UpdateCardStatusUC = async ({
  id,
  progress,
}) => {
  const now = new Date().toISOString();
  const data = updateProgress({ progress, now });

  try {
    await cardsAPI.update(id, data);
    cardsStorage.update(id, data);
    notificationService.notify("updated");
  } catch (error) {
    const message = (() => {
      return error instanceof Error ? error.message : "unknown error";
    })();
    notificationService.notify(message);
  }
};
