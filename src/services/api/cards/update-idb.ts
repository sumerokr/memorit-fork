// TODO: ensure that put only updates
import { getDBInstance } from "@/services/idb-storage";
import type { UpdateCardApi } from "@/application/update-card";

// TODO: handle JSON errors
export const updateCardApi: UpdateCardApi = async ({ id, data }) => {
  console.time("api/cards/updateCardApi");
  const db = await getDBInstance();
  const transaction = db.transaction("cards", "readwrite");
  const card = await transaction.store.get(id);
  if (card) {
    const updatedCard = Object.assign(card, data);
    await transaction.store.put(updatedCard);
    console.timeEnd("api/cards/updateCardApi");
    return updatedCard;
  } else {
    // TODO: handle error better
    throw new Error("api/cards/updateCardApi");
  }
};
