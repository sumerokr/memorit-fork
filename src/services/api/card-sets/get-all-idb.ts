import type { GetCardSetsApi } from "@/application/get-card-sets";
import { getDBInstance } from "@/services/idb-storage";
import type { CardSet } from "@/domain/card-set";

// TODO: handle JSON errors
export const getAllCardSetsApi: GetCardSetsApi = async (args) => {
  console.time("api/card-sets/getAllCardSetsApi");
  const { before, after, query } = args ?? {};
  const response: Awaited<ReturnType<GetCardSetsApi>> = {
    data: [],
  };

  const db = await getDBInstance();
  const transaction = db.transaction(["card-sets", "cards"]);

  let cursor = await transaction
    .objectStore("card-sets")
    .index("createdAt")
    .openCursor(null, before ? "next" : "prev");

  if (cursor) {
    const moveCursorToStartEntry = async (reference: CardSet["id"]) => {
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
          if (!cursor.value.title.toLowerCase().includes(query.toLowerCase())) {
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
          if (!cursor.value.title.toLowerCase().includes(query.toLowerCase())) {
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
    const cardsToStudyCount = 0;

    const cardsCount = await cardsCountPromise;

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

  console.timeEnd("api/card-sets/getAllCardSetsApi");
  return response;
};
