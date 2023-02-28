// https://www.npmjs.com/package/idb
import { openDB } from "idb";
import type { DBSchema /* , IDBPDatabase */ } from "idb";
import type { CardSet } from "@/domain/card-set";
import type { Card } from "@/domain/card";

export type CardSetPlain = Pick<CardSet, "id" | "title" | "createdAt">;

interface MyDB1 extends DBSchema {
  "card-sets": {
    value: CardSetPlain;
    key: CardSetPlain["id"];
    indexes: { createdAt: CardSetPlain["createdAt"] };
  };
  cards: {
    value: Card;
    key: Card["id"];
    indexes: {
      createdAt: Card["createdAt"];
      cardSetId: Card["cardSetId"];
      cardSetId_createdAt: [Card["cardSetId"], Card["createdAt"]];
      cardSetId_showAfter: [Card["cardSetId"], Card["showAfter"]];
    };
  };
}

let db: ReturnType<typeof openDB<MyDB1>>;

export const getDBInstance = async () => {
  if (db) {
    return db;
  }

  db = openDB<MyDB1>("memorit", 1, {
    upgrade: (db, oldVersion /* , newVersion, transaction */) => {
      const addCardSets = () => {
        const cardSetsStore = db.createObjectStore("card-sets", {
          keyPath: "id",
        });
        cardSetsStore.createIndex("createdAt", "createdAt");
      };
      const addCards = () => {
        const cardsStore = db.createObjectStore("cards", {
          keyPath: "id",
        });
        cardsStore.createIndex("createdAt", "createdAt");
        cardsStore.createIndex("cardSetId", "cardSetId");
        cardsStore.createIndex("cardSetId_createdAt", [
          "cardSetId",
          "createdAt",
        ]);
        cardsStore.createIndex("cardSetId_showAfter", [
          "cardSetId",
          "showAfter",
        ]);
      };

      if (oldVersion < 1) {
        // Cast a reference of the database to the old schema.
        // const v1Db = db as unknown as IDBPDatabase<MyDBV1>;
        addCardSets();
        addCards();
      }
    },
  });
  // @ts-ignore
  // window.db = db;

  return db;
};
