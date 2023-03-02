// TODO: ensure that put only updates

import type { CardSetAPI } from "@/application/ports";
import type { CardSet } from "@/domain/card-set";
import { getDBInstance } from "./idb-storage";
import type { CardSetPlain } from "./idb-storage";

const cardSetPlainToCardSet = (
  cardSetPlain: CardSetPlain,
  cardsCount: CardSet["cardsCount"],
  cardsToStudyCount: CardSet["cardsToStudyCount"]
): CardSet => {
  return {
    ...cardSetPlain,
    cardsCount,
    cardsToStudyCount,
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
    await db.add("card-sets", cardSetToCardSetPlain(cardSet));
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
      const moveCursorToStartEntry = async (reference: string) => {
        const startEntry = await transaction
          .objectStore("card-sets")
          .get(reference);
        if (!startEntry) {
          // TODO: handle. Reverse cursor?
        } else {
          if (cursor!.primaryKey !== startEntry.id) {
            return cursor!.continuePrimaryKey(startEntry.createdAt, reference);
          } else {
            return cursor;
          }
        }
      };
      if (before) {
        // @ts-ignore
        cursor = await moveCursorToStartEntry(before);
      } else if (after) {
        // @ts-ignore
        cursor = await moveCursorToStartEntry(after);
      }
    }

    const limit = 2;
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
              console.log("check in. no match. CONTINUE");
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
              console.log("check in. no match. CONTINUE");
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
      console.log("check");
      if (
        query &&
        !cursor.value.title.toLowerCase().includes(query.toLowerCase())
      ) {
        console.log("check in. no match. CONTINUE");
        console.log("cursow was", cursor.key);
        cursor = await cursor.continue();
        continue;
      }
      console.log("check out");

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

      response.data.push(
        cardSetPlainToCardSet(cursor.value, cardsCount, cardsToStudyCount)
      );
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
    const db = await getDBInstance();
    const transaction = db.transaction(["card-sets", "cards"]);
    const [cardSetPlain, cardsCount, cardsToStudyCount] = await Promise.all([
      transaction.objectStore("card-sets").get(id),
      transaction.objectStore("cards").index("cardSetId").count(id),
      transaction
        .objectStore("cards")
        .index("cardSetId_showAfter")
        .count(IDBKeyRange.bound([id, ""], [id, new Date().toISOString()])),
      transaction.done,
    ]);

    if (cardSetPlain) {
      return cardSetPlainToCardSet(cardSetPlain, cardsCount, cardsToStudyCount);
    }
    throw Error("IDB. Card sets. getById. No card set found.");
  },

  delete: async (id) => {
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
  },

  update: async (id, data) => {
    const db = await getDBInstance();
    const transaction = db.transaction("card-sets", "readwrite");
    const cardSet = await transaction.store.get(id);
    if (cardSet) {
      Object.assign(cardSet, data);
      await transaction.store.put(cardSet);
    } else {
      // TODO: handle error better
      throw new Error("IDB. Card sets. Update. No card set found.");
    }
  },
};
