import type { Card } from "@/domain/card";
import type { CardSet } from "@/domain/card-set";
import type { Stat } from "@/domain/stat";
import type { IDBPTransaction } from "idb";
import type { MyDB1 } from "@/services/idb-storage";
// import { getDBInstance } from "@/services/idb-storage";

export const getPairs = async ({
  cardSetId,
  transaction,
}: {
  cardSetId: CardSet["id"];
  transaction: IDBPTransaction<MyDB1, ("cards" | "stats")[], "readonly">;
}) => {
  const cardsStore = transaction.objectStore("cards");
  const statsStore = transaction.objectStore("stats");

  const pairs: Array<
    | {
        type: "showAfter";
        cardId: Card["id"];
        date: Stat["showAfter"];
      }
    | {
        type: "createdAt";
        cardId: Card["id"];
        date: Card["createdAt"];
      }
  > = [];

  let cursor = await cardsStore
    .index("cardSetId_createdAt")
    .openCursor(IDBKeyRange.bound([cardSetId, ""], [cardSetId, new Date().toISOString()]));

  // for each iterated card
  while (cursor) {
    const stat = await statsStore.index("cardId").get(cursor.value.id);

    if (stat && stat.progress !== -1) {
      pairs.push({
        type: "showAfter",
        cardId: cursor.value.id,
        date: stat.showAfter,
      });
    } else {
      pairs.push({
        type: "createdAt",
        cardId: cursor.value.id,
        date: cursor.value.createdAt,
      });
    }

    cursor = await cursor.continue();
  }

  pairs.sort((a, b) => {
    if (a.type === "showAfter") {
      if (b.type === "createdAt") {
        return -1;
      }
      if (b.type === "showAfter") {
        if (a.date < b.date) {
          return -1;
        }
        if (a.date > b.date) {
          return 1;
        }
        return 0;
      }
    } else if (a.type === "createdAt") {
      if (b.type === "showAfter") {
        return 1;
      }
      if (b.type === "createdAt") {
        if (a.date < b.date) {
          return -1;
        }
        if (a.date > b.date) {
          return 1;
        }
        return 0;
      }
    }
    return 0;
  });

  return pairs.filter(({ date }) => date < new Date().toISOString());
};
