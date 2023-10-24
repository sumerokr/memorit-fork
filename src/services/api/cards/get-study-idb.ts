import type { GetStudyCardsApi } from "@/application/get-study-cards";
import type { Card } from "@/domain/card";
import { getDBInstance } from "@/services/idb-storage";

// TODO: handle JSON errors
export const getStudyCardsApi: GetStudyCardsApi = async ({ cardSetId }) => {
  console.time("api/cards/getStudyCardsApi");

  const db = await getDBInstance();
  const transaction = db.transaction(["cards", "stats"]);
  const statsStore = transaction.objectStore("stats");
  const statsByCardIdIndex = statsStore.index("cardId");

  const pairs: Array<[Card["id"], string]> = [];
  const response: Awaited<ReturnType<GetStudyCardsApi>> = [];

  let cursor = await transaction
    .objectStore("cards")
    .index("cardSetId_createdAt")
    .openCursor(IDBKeyRange.bound([cardSetId, ""], [cardSetId, new Date().toISOString()]));

  // for each iterated card
  while (cursor) {
    const stat = await statsByCardIdIndex.get(cursor.value.id);

    if (stat && stat.progress !== -1) {
      pairs.push([cursor.value.id, stat.showAfter]);
    } else {
      pairs.push([cursor.value.id, cursor.value.createdAt]);
    }

    cursor = await cursor.continue();
  }

  pairs.sort(([, aDate], [, bDate]) => {
    if (aDate < bDate) {
      return -1;
    } else if (aDate > bDate) {
      return 1;
    } else {
      return 0;
    }
  });

  const slice = pairs.filter(([, date]) => date < new Date().toISOString()).slice(0, 10);

  const promises = slice.map(([cardId]) => {
    const cardPromise = transaction.objectStore("cards").get(cardId);
    const statPromise = statsByCardIdIndex.get(cardId);

    return Promise.all([cardPromise, statPromise]);
  });

  (await Promise.all(promises)).forEach(([card, stat]) => {
    response.push({ card: card!, stat: stat ?? null });
  });

  await transaction.done;

  console.timeEnd("api/cards/getStudyCardsApi");

  return response;
};
