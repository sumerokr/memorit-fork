// https://www.npmjs.com/package/idb
import { openDB } from "idb";
import type { DBSchema, IDBPDatabase } from "idb";
import type { CardSet, CardSetV2 } from "@/domain/card-set";
import { type Card, type CardV2, toV2 } from "@/domain/card";

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

interface MyDB2 extends DBSchema {
  "card-sets": {
    value: CardSetV2;
    key: CardSetV2["id"];
    indexes: { createdAt: CardSetV2["createdAt"] };
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

interface MyDB3 extends DBSchema {
  "card-sets": {
    value: CardSetV2;
    key: CardSetV2["id"];
    indexes: { createdAt: CardSetV2["createdAt"] };
  };
  cards: {
    value: CardV2;
    key: CardV2["id"];
    indexes: {
      createdAt: CardV2["createdAt"];
      cardSetId: CardV2["cardSetId"];
      cardSetId_createdAt: [CardV2["cardSetId"], CardV2["createdAt"]];
      cardSetId_showAfter: [CardV2["cardSetId"], CardV2["showAfter"]];
    };
  };
}

let db: ReturnType<typeof openDB<MyDB3>>;

export const getDBInstance = async () => {
  if (db) {
    return db;
  }

  db = openDB<MyDB3>("memorit", 2, {
    upgrade: async (db, oldVersion, newVersion, transaction) => {
      if (oldVersion < 1) {
        // Cast a reference of the database to the old schema.
        const dbv1 = db as unknown as IDBPDatabase<MyDB1>;
        const cardSetsStore = dbv1.createObjectStore("card-sets", {
          keyPath: "id",
        });
        cardSetsStore.createIndex("createdAt", "createdAt");

        const cardsStore = dbv1.createObjectStore("cards", {
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
      }

      if (oldVersion < 2) {
        // Cast a reference of the database to the old schema.
        let cursor = await transaction.objectStore("card-sets").openCursor();

        while (cursor) {
          const { id, title, createdAt } = cursor.value;
          cursor.update({
            id,
            title,
            createdAt,
            createdBy: "",
            updatedAt: createdAt,
            updatedBy: "",
            _v: 2,
          });
          cursor = await cursor.continue();
        }
      }

      if (oldVersion < 3) {
        // Cast a reference of the database to the old schema.
        let cursor = await transaction.objectStore("cards").openCursor();

        while (cursor) {
          const cardV2 = toV2(cursor.value);
          cursor.update(cardV2);
          cursor = await cursor.continue();
        }
      }
    },
  });
  // @ts-ignore
  // window.db = db;

  return db;
};
