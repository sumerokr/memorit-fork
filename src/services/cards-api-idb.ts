import type { CardsAPI } from "@/application/ports";
import { getDBInstance } from "./idb-storage";

// TODO: handle JSON errors
export const cardsAPI: CardsAPI = {
  save: async (card) => {
    const db = await getDBInstance();
    db.add("cards", card);
  },

  getAllByCardSetId: async (id) => {
    const db = await getDBInstance();
    const transaction = db.transaction("cards");
    let cursor = await transaction
      .objectStore("cards")
      .index("cardSetId_createdAt")
      .openCursor(
        IDBKeyRange.upperBound([id, new Date().toISOString()]),
        "prev"
      );

    const result = [];
    const limit = 10;
    let step = 0;

    while (cursor && step < limit) {
      result.push(cursor.value);
      step += 1;
      cursor = await cursor.continue();
    }

    return result;
  },

  delete: async (id) => {
    const db = await getDBInstance();
    await db.delete("cards", id);
  },

  update: async (card) => {
    const db = await getDBInstance();
    await db.put("cards", card);
  },
};
