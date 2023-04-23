import { type CardV2, updateProgress } from "@/domain/card";
import { getCardApi } from "@/services/api/cards/get-idb";
import { updateCardApi } from "@/services/api/cards/update-idb";
import { notificationService } from "@/services/index";

//#region types
type UpdateCardProgressUCParameters = {
  id: CardV2["id"];
  success: boolean;
};

export type UpdateCardProgressUC = (
  args: UpdateCardProgressUCParameters
) => Promise<CardV2>;
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
