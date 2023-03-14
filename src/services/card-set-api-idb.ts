// TODO: ensure that put only updates

import type { CardSetAPI } from "@/application/ports";
import type { CardSetV2 } from "@/domain/card-set";
import { getDBInstance } from "./idb-storage";

// TODO: handle JSON errors
export const cardSetAPI: CardSetAPI = {
  save: async (cardSet) => {
    console.time("api/card-sets/save");
    const db = await getDBInstance();
    await db.add("card-sets", cardSet);
    console.timeEnd("api/card-sets/save");
  },

  getAll: async (args) => {
    console.time("CardSetAPI.getAll");
    const { before, after, query } = args ?? {};
    const response: Awaited<ReturnType<CardSetAPI["getAll"]>> = {
      data: [],
    };

    const db = await getDBInstance();
    const transaction = db.transaction(["card-sets", "cards"]);

    let cursor = await transaction
      .objectStore("card-sets")
      .index("createdAt")
      .openCursor(null, before ? "next" : "prev");

    if (cursor) {
      const moveCursorToStartEntry = async (reference: CardSetV2["id"]) => {
        const startEntry = await transaction
          .objectStore("card-sets")
          .get(reference);
        if (!startEntry) {
          // TODO: handle. Reverse cursor?
          return cursor;
        } else {
          if (cursor!.primaryKey !== startEntry.id) {
            return cursor!.continuePrimaryKey(startEntry.createdAt, reference);
          } else {
            return cursor;
          }
        }
      };
      if (before) {
        cursor = await moveCursorToStartEntry(before);
      } else if (after) {
        cursor = await moveCursorToStartEntry(after);
      }
    }

    const limit = 24;
    let step = 0;

    while (cursor && step <= limit) {
      if (step === 0) {
        if (before) {
          response.after = cursor.primaryKey;
          step += 1;
          cursor = await cursor.continue();
          continue;
        } else if (after) {
          if (!query) {
            response.before = cursor.primaryKey;
          } else {
            if (
              !cursor.value.title.toLowerCase().includes(query.toLowerCase())
            ) {
              cursor = await cursor.continue();
              continue;
            } else {
              response.before = cursor.primaryKey;
            }
          }
        }
      } else if (step === limit) {
        if (before) {
          response.before = cursor.primaryKey;
        } else {
          if (!query) {
            response.after = cursor.primaryKey;
            break;
          } else {
            if (
              !cursor.value.title.toLowerCase().includes(query.toLowerCase())
            ) {
              cursor = await cursor.continue();
              continue;
            } else {
              response.after = cursor.primaryKey;
              break;
            }
          }
        }
      }

      // query search
      if (
        query &&
        !cursor.value.title.toLowerCase().includes(query.toLowerCase())
      ) {
        cursor = await cursor.continue();
        continue;
      }

      //#region meat
      const cardsCountPromise = transaction
        .objectStore("cards")
        .index("cardSetId")
        .count(cursor.value.id);
      const cardsToStudyCountPromise = transaction
        .objectStore("cards")
        .index("cardSetId_showAfter")
        .count(
          IDBKeyRange.bound(
            [cursor.value.id, ""],
            [cursor.value.id, new Date().toISOString()]
          )
        );

      const [cardsCount, cardsToStudyCount] = await Promise.all([
        cardsCountPromise,
        cardsToStudyCountPromise,
      ]);

      response.data.push({
        ...cursor.value,
        cardsCount,
        cardsToStudyCount,
      });
      //#endregion meat

      step += 1;
      cursor = await cursor.continue();
    }

    if (before) {
      if (!cursor) {
        delete response.before;
      } else if (query) {
        while (cursor) {
          if (!cursor.value.title.toLowerCase().includes(query.toLowerCase())) {
            cursor = await cursor.continue();
            continue;
          } else {
            break;
          }
        }

        if (!cursor) {
          delete response.before;
        }
      }
    }

    if (before) {
      response.data.reverse();
    }

    console.timeEnd("CardSetAPI.getAll");
    return response;
  },

  getById: async (id) => {
    console.time("CardSetAPI.getById");
    const db = await getDBInstance();
    const transaction = db.transaction(["card-sets", "cards"]);
    const [cardSet, cardsCount, cardsToStudyCount] = await Promise.all([
      transaction.objectStore("card-sets").get(id),
      transaction.objectStore("cards").index("cardSetId").count(id),
      transaction
        .objectStore("cards")
        .index("cardSetId_showAfter")
        .count(IDBKeyRange.bound([id, ""], [id, new Date().toISOString()])),
      transaction.done,
    ]);

    if (cardSet) {
      console.timeEnd("CardSetAPI.getById");
      return {
        ...cardSet,
        cardsCount,
        cardsToStudyCount,
      };
    }
    throw Error("IDB. Card sets. getById. No card set found.");
  },

  delete: async (id) => {
    console.time("CardSetAPI.delete");
    const db = await getDBInstance();
    const transaction = db.transaction(["card-sets", "cards"], "readwrite");
    const promises = [];

    promises.push(transaction.objectStore("card-sets").delete(id));

    let cursor = await transaction
      .objectStore("cards")
      .index("cardSetId")
      .openCursor(IDBKeyRange.bound(id, id));

    while (cursor) {
      promises.push(transaction.objectStore("cards").delete(cursor.value.id));
      cursor = await cursor.continue();
    }

    await Promise.all(promises.concat(transaction.done));
    console.timeEnd("CardSetAPI.delete");
  },

  update: async (id, data) => {
    console.time("CardSetAPI.update");
    const db = await getDBInstance();
    const transaction = db.transaction("card-sets", "readwrite");
    const cardSet = await transaction.store.get(id);
    if (cardSet) {
      Object.assign(cardSet, data);
      await transaction.store.put(cardSet);
      console.timeEnd("CardSetAPI.update");
    } else {
      // TODO: handle error better
      throw new Error("IDB. Card sets. Update. No card set found.");
    }
  },
};
