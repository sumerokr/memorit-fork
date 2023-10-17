import type { GetCardSetApi } from "@/application/get-card-set";
import { getDBInstance } from "@/services/idb-storage";

export const getCardSetApi: GetCardSetApi = async ({ id }) => {
  console.time("api/card-sets/getCardSetApi");
  const db = await getDBInstance();
  const transaction = db.transaction(["card-sets", "cards"]);

  const [cardSet, cardsCount] = await Promise.all([
    transaction.objectStore("card-sets").get(id),
    transaction
      .objectStore("cards")
      .index("cardSetId_createdAt")
      .count(IDBKeyRange.bound([id, ""], [id, new Date().toISOString()])),
    transaction.done,
  ]);

  if (cardSet) {
    console.timeEnd("api/card-sets/getCardSetApi");
    return {
      ...cardSet,
      cardsCount,
      cardsToStudyCount: 0,
    };
  }
  console.timeEnd("api/card-sets/getCardSetApi");
  throw Error("api/card-sets/getCardSetApi");
};
