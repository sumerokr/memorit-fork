import type { CardSetAPI } from "@/application/ports";
import type { CardSet } from "@/domain/card-set";
import { getDBInstance } from "./idb-storage";
import type { CardSetPlain } from "./idb-storage";

const cardSetPlainToCardSet = (
  cardSetPlain: CardSetPlain,
  cardsCount: CardSet["cardsCount"]
): CardSet => {
  return {
    ...cardSetPlain,
    cardsCount,
  };
};
const cardSetToCardSetPlain = (cardSet: CardSet): CardSetPlain => {
  const { id, title, createdAt } = cardSet;
  return { id, title, createdAt };
};

// TODO: handle JSON errors
export const cardSetAPI: CardSetAPI = {
  save: async (cardSet) => {
    const db = await getDBInstance();
    db.add("card-sets", cardSetToCardSetPlain(cardSet));
  },

  getAll: async () => {
    const db = await getDBInstance();
    const transaction = db.transaction(["card-sets", "cards"]);
    let cursor = await transaction
      .objectStore("card-sets")
      .index("createdAt")
      .openCursor(null, "prev");

    const result = [];
    const limit = 10;
    let step = 0;

    while (cursor && step < limit) {
      const cardsCount = await transaction
        .objectStore("cards")
        .index("cardSetId")
        .count(cursor.value.id);

      result.push(cardSetPlainToCardSet(cursor.value, cardsCount));
      step += 1;
      cursor = await cursor.continue();
    }

    return result;
  },

  getById: async (id) => {
    const db = await getDBInstance();
    const transaction = db.transaction(["card-sets", "cards"]);
    const [cardSetPlain, cardsCount] = await Promise.all([
      transaction.objectStore("card-sets").get(id),
      transaction.objectStore("cards").index("cardSetId").count(id),
    ]);

    if (cardSetPlain) {
      return cardSetPlainToCardSet(cardSetPlain, cardsCount);
    }
    throw Error("cardSet not found");
  },

  delete: async (id) => {
    const db = await getDBInstance();
    await db.delete("card-sets", id);
  },

  update: async (cardSet) => {
    const db = await getDBInstance();
    await db.put("card-sets", cardSetToCardSetPlain(cardSet));
  },
};
