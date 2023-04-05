// TODO: ensure that put only updates

import type { CardsAPI } from "@/application/ports";
import { getDBInstance } from "./idb-storage";
import type { Card } from "@/domain/card";

// TODO: handle JSON errors
export const cardsAPI: CardsAPI = {
  getAllByCardSetId: async (id, args) => {
    console.time("CardsAPI.getAllByCardSetId");
    const { before, after, query } = args ?? {};
    const response: Awaited<ReturnType<CardsAPI["getAllByCardSetId"]>> = {
      data: [],
    };

    const db = await getDBInstance();
    const transaction = db.transaction("cards");

    let cursor = await transaction
      .objectStore("cards")
      .index("cardSetId_createdAt")
      .openCursor(
        IDBKeyRange.bound([id, ""], [id, new Date().toISOString()]),
        before ? "next" : "prev"
      );

    if (cursor) {
      const moveCursorToStartEntry = async (reference: Card["id"]) => {
        const startEntry = await transaction
          .objectStore("cards")
          .get(reference);
        if (!startEntry) {
          // TODO: handle. Reverse cursor?
          return cursor;
        } else {
          if (cursor!.primaryKey !== startEntry.id) {
            return cursor!.continuePrimaryKey(
              [startEntry.cardSetId, startEntry.createdAt],
              reference
            );
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
              !(
                cursor.value.front
                  .toLowerCase()
                  .includes(query.toLowerCase()) ||
                cursor.value.back.toLowerCase().includes(query.toLowerCase())
              )
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
              !(
                cursor.value.front
                  .toLowerCase()
                  .includes(query.toLowerCase()) ||
                cursor.value.back.toLowerCase().includes(query.toLowerCase())
              )
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
        !(
          cursor.value.front.toLowerCase().includes(query.toLowerCase()) ||
          cursor.value.back.toLowerCase().includes(query.toLowerCase())
        )
      ) {
        cursor = await cursor.continue();
        continue;
      }

      //#region meat
      response.data.push(cursor.value);
      //#endregion meat

      step += 1;
      cursor = await cursor.continue();
    }

    if (before) {
      if (!cursor) {
        delete response.before;
      } else if (query) {
        while (cursor) {
          if (
            !(
              cursor.value.front.toLowerCase().includes(query.toLowerCase()) ||
              cursor.value.back.toLowerCase().includes(query.toLowerCase())
            )
          ) {
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

    console.timeEnd("CardsAPI.getAllByCardSetId");
    return response;
  },

  getStudyCards: async (id) => {
    const db = await getDBInstance();
    return db.getAllFromIndex(
      "cards",
      "cardSetId_showAfter",
      IDBKeyRange.bound([id, ""], [id, new Date().toISOString()]),
      10
    );
  },

  delete: async (id) => {
    const db = await getDBInstance();
    await db.delete("cards", id);
  },
};
