import type { UpdateCardSetApi } from "@/application/update-card-set";
import { getDBInstance } from "@/services/idb-storage";

// TODO: handle JSON errors
export const updateCardSetApi: UpdateCardSetApi = async ({ id, data }) => {
  console.time("api/card-sets/updateCardSetApi");
  const db = await getDBInstance();
  const transaction = db.transaction("card-sets", "readwrite");

  const cardSet = await transaction.store.get(id);

  if (cardSet) {
    const updatedCardSet = {
      ...cardSet,
      ...data,
    };
    await transaction.store.put(updatedCardSet);
    console.timeEnd("api/card-sets/updateCardSetApi");
    return updatedCardSet;
  } else {
    // TODO: handle error better
    console.timeEnd("api/card-sets/updateCardSetApi");
    throw new Error("api/card-sets/updateCardSetApi");
  }
};
