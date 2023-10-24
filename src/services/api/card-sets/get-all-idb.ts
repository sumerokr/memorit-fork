import type { GetCardSetsApi } from "@/application/get-card-sets";
import { getDBInstance } from "@/services/idb-storage";

// TODO: handle JSON errors
export const getAllCardSetsApi: GetCardSetsApi = async () => {
  console.time("api/card-sets/getAllCardSetsApi");

  const db = await getDBInstance();
  const transaction = db.transaction(["card-sets", "cards", "stats"]);
  const cardSetStore = transaction.objectStore("card-sets");
  const cardsStore = transaction.objectStore("cards");
  const statsStore = transaction.objectStore("stats");
  const now = new Date().toISOString();

  const response: Awaited<ReturnType<GetCardSetsApi>> = [];

  // iterate all card-sets via index in reverse order (new first)
  let cursor = await cardSetStore.index("createdAt").openCursor(null, "prev");

  // for each iterated card-set count cards and cards to study
  while (cursor) {
    const cardSetId = cursor.primaryKey;
    const cardsCount = await cardsStore
      .index("cardSetId_createdAt")
      .count(IDBKeyRange.bound([cardSetId, ""], [cardSetId, new Date().toISOString()]));

    const allKeys = await cardsStore
      .index("cardSetId_createdAt")
      .getAllKeys(IDBKeyRange.bound([cardSetId, ""], [cardSetId, new Date().toISOString()]));

    const promises = allKeys.map((cardId) => statsStore.index("cardId").get(cardId));

    const stats = await Promise.all(promises);

    const cardsToStudyCount = stats.filter((stat) => {
      // include ones that weren't studied yet
      if (!stat) {
        return true;
      }

      // skip ones that were skipped
      if (stat.progress !== -1) {
        return false;
      }

      // include ones that have showAfter in the past
      return stat.showAfter < now;
    }).length;

    response.push({
      cardSet: cursor.value,
      cardsCount,
      cardsToStudyCount,
    });

    cursor = await cursor.continue();
  }

  await transaction.done;

  console.timeEnd("api/card-sets/getAllCardSetsApi");
  return response;
};
