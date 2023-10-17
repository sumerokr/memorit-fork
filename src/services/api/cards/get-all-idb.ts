import type { GetCardsApi } from "@/application/get-cards";
import { getDBInstance } from "@/services/idb-storage";

// TODO: handle JSON errors
export const getAllCardsApi: GetCardsApi = async ({ cardSetId }) => {
  console.time("api/cards/getAllCardsApi");

  const db = await getDBInstance();
  const transaction = db.transaction("cards");

  const response: Awaited<ReturnType<GetCardsApi>> = [];

  // iterate all cards via index in reverse order (new first)
  let cursor = await transaction
    .objectStore("cards")
    .index("cardSetId_createdAt")
    .openCursor(
      IDBKeyRange.bound([cardSetId, ""], [cardSetId, new Date().toISOString()]),
      "prev"
    );

  // for each iterated card
  while (cursor) {
    response.push(cursor.value);
    cursor = await cursor.continue();
  }

  await transaction.done;

  console.timeEnd("api/cards/getAllCardsApi");
  return response;
};
