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
    console.time("cardsAPI.update");
    await cardsAPI.update(id, data);
    console.timeEnd("cardsAPI.update");
    cardsStorage.update(id, data);
    notificationService.notify("updated");
  } catch (error) {
    notificationService.error(error);
  }
};
