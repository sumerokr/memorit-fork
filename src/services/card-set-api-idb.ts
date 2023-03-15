// TODO: ensure that put only updates

import type { CardSetAPI } from "@/application/ports";
import type { CardSetV2 } from "@/domain/card-set";
import { getDBInstance } from "./idb-storage";

// TODO: handle JSON errors
export const cardSetAPI: CardSetAPI = {
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
};
