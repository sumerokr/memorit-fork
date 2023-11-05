import type { GetStudyCardsApi } from "@/application/get-study-cards";
import { getDBInstance } from "@/services/idb-storage";
import { getPairs } from "@/services/api/utils";

// TODO: handle JSON errors
export const getStudyCardsApi: GetStudyCardsApi = async ({ cardSetId }) => {
  console.time("api/cards/getStudyCardsApi");

  const db = await getDBInstance();
  const transaction = db.transaction(["cards", "stats"]);
  const statsStore = transaction.objectStore("stats");
  const statsByCardIdIndex = statsStore.index("cardId");

  const response: Awaited<ReturnType<GetStudyCardsApi>> = [];

  const pairs = await getPairs({ cardSetId, transaction });
  const slice = pairs.slice(0, 10);

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
