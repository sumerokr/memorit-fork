import type { ImportCardSetApi } from "@/application/import-card-set";
import { getDBInstance } from "@/services/idb-storage";

// TODO: handle JSON errors
export const importCardSetApi: ImportCardSetApi = async ({
  cardSet,
  cards,
}) => {
  console.time("api/importCardSetApi");
  const db = await getDBInstance();
  const transaction = db.transaction(["card-sets", "cards"], "readwrite");
  const cardSetsStore = transaction.objectStore("card-sets");
  const cardsStore = transaction.objectStore("cards");
  const promises = [];

  promises.push(cardSetsStore.add(cardSet));

  cards.forEach((card) => {
    promises.push(cardsStore.add(card));
  });

  promises.push(transaction.done);

  await Promise.all(promises);

  console.timeEnd("api/importCardSetApi");
};
