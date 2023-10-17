import type { DeleteCardSetApi } from "@/application/delete-card-set";
import { getDBInstance } from "@/services/idb-storage";

// TODO: handle JSON errors
export const deleteCardSetApi: DeleteCardSetApi = async ({ id }) => {
  console.time("api/card-sets/deleteCardSetApi");
  const db = await getDBInstance();
  const transaction = db.transaction(["card-sets", "cards"], "readwrite");
  const promises = [];

  // TODO: check user id
  let cursor = await transaction
    .objectStore("cards")
    .index("cardSetId_createdAt")
    .openCursor(IDBKeyRange.bound([id, ""], [id, new Date().toISOString()]));

  while (cursor) {
    promises.push(transaction.objectStore("cards").delete(cursor.value.id));
    cursor = await cursor.continue();
  }

  promises.push(transaction.objectStore("card-sets").delete(id));
  promises.push(transaction.done);

  await Promise.all(promises);
  console.timeEnd("api/card-sets/deleteCardSetApi");
};
