import type { DeleteCardApi } from "@/application/delete-card";
import { getDBInstance } from "@/services/idb-storage";

// TODO: handle JSON errors
export const deleteCardApi: DeleteCardApi = async ({ id }) => {
  console.time("api/cards/deleteCardApi");
  const db = await getDBInstance();
  const transaction = db.transaction(["cards"], "readwrite");

  await transaction.objectStore("cards").delete(id);
  console.timeEnd("api/cards/deleteCardApi");
};
