// https://www.npmjs.com/package/idb
import { openDB } from "idb";
import type { DBSchema, IDBPDatabase } from "idb";
import type { CardSet } from "@/domain/card-set";
import type { Card } from "@/domain/card";

interface MyDB1 extends DBSchema {
  "card-sets": {
    value: CardSet;
    key: CardSet["id"];
    indexes: { createdAt: CardSet["createdAt"] };
  };
  cards: {
    value: Card;
    key: Card["id"];
    indexes: {
      createdAt: Card["createdAt"];
      cardSetId: Card["cardSetId"];
    };
  };
}

let db: ReturnType<typeof openDB<MyDB1>>;

export const getDBInstance = async () => {
  if (db) {
    return db;
  }

  db = openDB<MyDB1>("memorit", 1, {
    upgrade: async (db, oldVersion, newVersion, transaction) => {
      console.log("upgrade", db, oldVersion, newVersion, transaction);

      // If there's no oldVersion, then this is a new database
      if (oldVersion === 0) {
        const dbv1 = db as IDBPDatabase<MyDB1>;
        const cardSetsStore = dbv1.createObjectStore("card-sets", {
          keyPath: "id",
        });
        cardSetsStore.createIndex("createdAt", "createdAt");

        const cardsStore = dbv1.createObjectStore("cards", {
          keyPath: "id",
        });
        cardsStore.createIndex("createdAt", "createdAt");
        cardsStore.createIndex("cardSetId", "cardSetId");
      }
    },
  });
  // @ts-ignore
  // window.db = db;

  return db;
};
