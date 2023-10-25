import type { GetOneOfFourCardsApi } from "@/application/get-one-of-four-cards";
import type { Card } from "@/domain/card";
import type { Stat } from "@/domain/stat";
import { getDBInstance } from "@/services/idb-storage";
import shuffle from "lodash/shuffle";

// TODO: handle JSON errors
export const getOneOfFourCardsApi: GetOneOfFourCardsApi = async ({ cardSetId }) => {
  console.time("api/cards/getOneOfFourCardsApi");

  const db = await getDBInstance();
  const transaction = db.transaction(["cards", "stats"]);
  const cardsStore = transaction.objectStore("cards");
  const statsStore = transaction.objectStore("stats");
  const statsByCardIdIndex = statsStore.index("cardId");

  const pairs: Array<[Card["id"], Card["createdAt"] | Stat["showAfter"]]> = [];
  const response: Awaited<ReturnType<GetOneOfFourCardsApi>> = [];

  let cursor = await cardsStore
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

  if (pairs.length < 40) {
    console.timeEnd("api/cards/getOneOfFourCardsApi");
    throw new Error("Not enough cards");
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

  // sort by date
  const filtered = pairs.filter(([, date]) => date < new Date().toISOString());

  const [primary, rest] = [filtered.slice(0, 10), filtered.slice(10)];
  const secondary = shuffle(rest).slice(0, 30);

  const primaryPromises = primary.map(([cardId]) => {
    const cardPromise = cardsStore.get(cardId);
    const statPromise = statsByCardIdIndex.get(cardId);

    return Promise.all([cardPromise, statPromise]);
  });

  const secondaryPromises = secondary.map(([cardId]) => cardsStore.get(cardId));

  const primaryItems = await Promise.all(primaryPromises);
  const secondaryItems = await Promise.all(secondaryPromises);

  primaryItems.forEach(([card, stat]) => {
    const rest = [secondaryItems.pop(), secondaryItems.pop(), secondaryItems.pop()];
    if (card && rest.every<Card>((item): item is Card => item !== undefined)) {
      response.push({
        card,
        // TODO: consider using undefined instead of null
        stat: stat || null,
        rest,
      });
    } else {
      throw new Error("Cannot create one of four response");
    }
  });

  await transaction.done;

  console.timeEnd("api/cards/getOneOfFourCardsApi");

  return response;
};
