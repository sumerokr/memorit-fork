import type { GetCardSetByIdUC } from "@/application/ports";
import type { CardSetV2 } from "@/domain/card-set";
import {
  cardSetAPI,
  cardSetStorage,
  notificationService,
} from "@/services/index";

export const getCardSetByIdUC: GetCardSetByIdUC = async (
  id: CardSetV2["id"]
) => {
  try {
    const cardSet = await cardSetAPI.getById(id);
    cardSetStorage.save(cardSet);
    notificationService.notify("received");
  } catch (error) {
    notificationService.error(error);
  }
};
