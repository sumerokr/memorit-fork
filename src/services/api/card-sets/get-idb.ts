import type { GetCardSetApi } from "@/application/get-card-set";
import { getDBInstance } from "@/services/idb-storage";
import type { ProgressMap } from "@/domain/stat";

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

  const statPromises = cardIds.map((cardId) => statsStore.index("cardId").get(cardId));

  const [cardSet, stats] = await Promise.all([getCardSetPromise, Promise.all(statPromises)]);

  const [cardsToStudyCount, progressMap] = stats.reduce<[number, Partial<ProgressMap>]>(
    (acc, stat) => {
      if (!stat) {
        acc[0] = (acc[0] ?? 0) + 1;
        acc[1][0] = (acc[1][0] ?? 0) + 1;
        return acc;
      }

      if (stat.progress === -1) {
        acc[1][stat.progress] = (acc[1][stat.progress] ?? 0) + 1;
        return acc;
      }

      if (stat.showAfter < now) {
        acc[0] = (acc[0] ?? 0) + 1;
      }

      acc[1][stat.progress] = (acc[1][stat.progress] ?? 0) + 1;
      return acc;
    },
    [0, {}]
  );

  if (cardSet) {
    console.timeEnd("api/card-sets/getCardSetApi");
    return {
      cardSet,
      cardsCount: cardIds.length,
      cardsToStudyCount,
      progressMap,
    };
  }

  console.timeEnd("api/card-sets/getCardSetApi");
  throw Error("api/card-sets/getCardSetApi");
};
