import type { GetOneOfFourCardsApi } from "@/application/get-one-of-four-cards";
import type { Card } from "@/domain/card";
import { getDBInstance } from "@/services/idb-storage";
import { getPairs } from "@/services/api/utils";
import shuffle from "lodash/shuffle";

// TODO: handle JSON errors
export const getOneOfFourCardsApi: GetOneOfFourCardsApi = async ({ cardSetId }) => {
  console.time("api/cards/getOneOfFourCardsApi");

  const db = await getDBInstance();
  const transaction = db.transaction(["cards", "stats"]);
  const cardsStore = transaction.objectStore("cards");
  const statsStore = transaction.objectStore("stats");
  const statsByCardIdIndex = statsStore.index("cardId");

  const response: Awaited<ReturnType<GetOneOfFourCardsApi>> = [];

  const pairs = await getPairs({ cardSetId, transaction });

  if (pairs.length < 40) {
    console.timeEnd("api/cards/getOneOfFourCardsApi");
    throw new Error("Not enough cards");
  }

  const [primary, rest] = [pairs.slice(0, 10), pairs.slice(10)];
  const secondary = shuffle(rest).slice(0, 30);

  const primaryPromises = primary.map(({ cardId }) => {
    const cardPromise = cardsStore.get(cardId);
    const statPromise = statsByCardIdIndex.get(cardId);

    return Promise.all([cardPromise, statPromise]);
  });

  const secondaryPromises = secondary.map(({ cardId }) => cardsStore.get(cardId));

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
