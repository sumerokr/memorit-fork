import type { Card } from "@/domain/card";
import { getCardApi } from "@/services/api/cards/get-idb";
import { updateCardApi } from "@/services/api/cards/update-idb";
import { notificationService } from "@/services/index";

//#region types
export type UpdateCardProgressUC = (args: {
  id: Card["id"];
  success: boolean;
}) => Promise<Card>;
//#endregion

export const updateCardProgressUC: UpdateCardProgressUC = async ({
  id,
  success,
}) => {
  try {
    const card = await getCardApi({ id });
    const updatedCard = updateProgress({
      card,
      success,
      now: new Date().toISOString(),
    });
    // TODO: we only have to save it. As is. Intead we do update :(
    await updateCardApi({ id, data: updatedCard });
    notificationService.notify("updated");
    return updatedCard;
  } catch (error) {
    notificationService.error(error);
    throw error;
  }
};
