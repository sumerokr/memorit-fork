import type { GetStudyCardsApi } from "@/application/get-study-cards";
import type { Card } from "@/domain/card";
import type { Stat } from "@/domain/stat";
import { getDBInstance } from "@/services/idb-storage";

// TODO: handle JSON errors
export const getStudyCardsApi: GetStudyCardsApi = async ({ cardSetId }) => {
  console.time("api/cards/getStudyCardsApi");

  const db = await getDBInstance();
  const transaction = db.transaction(["cards", "stats"]);
  const statsStore = transaction.objectStore("stats");
  const statsByCardIdIndex = statsStore.index("cardId");

  const pairs: Array<
    | {
        type: "showAfter";
        cardId: Card["id"];
        date: Stat["showAfter"];
      }
    | {
        type: "createdAt";
        cardId: Card["id"];
        date: Card["createdAt"];
      }
  > = [];
  const response: Awaited<ReturnType<GetStudyCardsApi>> = [];

  let cursor = await transaction
    .objectStore("cards")
    .index("cardSetId_createdAt")
    .openCursor(IDBKeyRange.bound([cardSetId, ""], [cardSetId, new Date().toISOString()]));

  // for each iterated card
  while (cursor) {
    const stat = await statsByCardIdIndex.get(cursor.value.id);

    if (stat && stat.progress !== -1) {
      pairs.push({
        type: "showAfter",
        cardId: cursor.value.id,
        date: stat.showAfter,
      });
    } else {
      pairs.push({
        type: "createdAt",
        cardId: cursor.value.id,
        date: cursor.value.createdAt,
      });
    }

    cursor = await cursor.continue();
  }

  pairs.sort((a, b) => {
    if (a.type === "showAfter") {
      if (b.type === "createdAt") {
        return -1;
      }
      if (b.type === "showAfter") {
        if (a.date < b.date) {
          return -1;
        }
        if (a.date > b.date) {
          return 1;
        }
        return 0;
      }
    } else if (a.type === "createdAt") {
      if (b.type === "showAfter") {
        return 1;
      }
      if (b.type === "createdAt") {
        if (a.date < b.date) {
          return -1;
        }
        if (a.date > b.date) {
          return 1;
        }
        return 0;
      }
    }
    return 0;
  });

  const slice = pairs.filter(({ date }) => date < new Date().toISOString()).slice(0, 10);

  const promises = slice.map(({ cardId }) => {
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
