import type { GetCardSetApi } from "@/application/get-card-set";
import { getDBInstance } from "@/services/idb-storage";

export const getCardSetApi: GetCardSetApi = async ({ id }) => {
  console.time("api/card-sets/getCardSetApi");
  const db = await getDBInstance();
  const transaction = db.transaction(["card-sets", "cards", "stats"]);
  const [cardSetsStore, cardsStore, statsStore] = [
    transaction.objectStore("card-sets"),
    transaction.objectStore("cards"),
    transaction.objectStore("stats"),
  ];
  const now = new Date().toISOString();

  const getCardSetPromise = cardSetsStore.get(id);

  const cardIds = await cardsStore
    .index("cardSetId_createdAt")
    .getAllKeys(IDBKeyRange.bound([id, ""], [id, new Date().toISOString()]));

  const promises = cardIds.map((cardId) => statsStore.index("cardId").get(cardId));

  const [cardSet, stats] = await Promise.all([getCardSetPromise, Promise.all(promises)]);

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

  if (cardSet) {
    console.timeEnd("api/card-sets/getCardSetApi");
    return {
      cardSet,
      cardsCount: cardIds.length,
      cardsToStudyCount,
    };
  }

  console.timeEnd("api/card-sets/getCardSetApi");
  throw Error("api/card-sets/getCardSetApi");
};
