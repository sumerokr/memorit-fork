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
        IDBKeyRange.bound([id, ""], [id, new Date().toISOString()]),
        "prev"
      );

    const result = [];
    const limit = 100;
    let step = 0;

    while (cursor && step < limit) {
      result.push(cursor.value);
      step += 1;
      cursor = await cursor.continue();
    }

    return result;
  },

  getStudyCards: async (id) => {
    const db = await getDBInstance();

    const transaction = db.transaction("cards");
    let cursor = await transaction
      .objectStore("cards")
      .index("cardSetId_showAfter")
      .openCursor(
        IDBKeyRange.bound([id, ""], [id, new Date().toISOString()]),
        "next"
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

  update: async (id, data) => {
    const db = await getDBInstance();
    const transaction = db.transaction("cards", "readwrite");
    const card = await transaction.store.get(id);
    if (card) {
      Object.assign(card, data);
      await transaction.store.put(card);
    } else {
      // TODO: handle error better
      throw new Error("IDB. Cards. Update. No card found.");
    }
  },
};
