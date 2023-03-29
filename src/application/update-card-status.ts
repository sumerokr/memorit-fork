import { CardV2, updateProgress } from "@/domain/card";
import { cardsAPI, cardsStorage, notificationService } from "@/services/index";

export type UpdateCardStatusUC = ({
  card,
  success,
}: {
  card: CardV2;
  success: boolean;
}) => Promise<void>;

export const updateCardStatusUC: UpdateCardStatusUC = async ({
  card,
  success,
}) => {
  const now = new Date().toISOString();
  const updatedCard = updateProgress({ card, success, now });

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
