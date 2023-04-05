import type { DeleteCardSetApi } from "@/application/delete-card-set";
import { getDBInstance } from "@/services/idb-storage";

// TODO: handle JSON errors
export const deleteCardSetApi: DeleteCardSetApi = async ({ id }) => {
  console.time("api/card-sets/deleteCardSetApi");
  const db = await getDBInstance();
  const transaction = db.transaction(["card-sets", "cards"], "readwrite");
  const promises = [];

  promises.push(transaction.objectStore("card-sets").delete(id));

  let cursor = await transaction
    .objectStore("cards")
    .index("cardSetId")
    .openCursor(IDBKeyRange.bound(id, id));

  while (cursor) {
    promises.push(transaction.objectStore("cards").delete(cursor.value.id));
    cursor = await cursor.continue();
  }

  promises.push(transaction.done);

  await Promise.all(promises);
  console.timeEnd("api/card-sets/deleteCardSetApi");
};
