import type { GetCardSetsApi } from "@/application/get-card-sets";
import { getDBInstance } from "@/services/idb-storage";
import type { CardSet } from "@/domain/card-set";

// TODO: handle JSON errors
export const getAllCardSetsApi: GetCardSetsApi = async () => {
  console.time("api/card-sets/getAllCardSetsApi");

  const db = await getDBInstance();
  const transaction = db.transaction(["card-sets", "cards"]);

  const response: Awaited<ReturnType<GetCardSetsApi>> = [];

  // iterate all card-sets via index in reverse order (new first)
  let cursor = await transaction
    .objectStore("card-sets")
    .index("createdAt")
    .openCursor(null, "prev");

  // for each iterated card-set count cards and cards to study
  while (cursor) {
    const cardSetId = cursor.primaryKey;
    const cardsCount = await transaction
      .objectStore("cards")
      .index("cardSetId_createdAt")
      .count(
        IDBKeyRange.bound(
          [cardSetId, ""],
          [cardSetId, new Date().toISOString()]
        )
      );
    const cardsToStudyCount = 0;

    response.push({
      ...cursor.value,
      cardsCount,
      cardsToStudyCount,
    });

    cursor = await cursor.continue();
  }

  await transaction.done;

  console.timeEnd("api/card-sets/getAllCardSetsApi");
  return response;
};
