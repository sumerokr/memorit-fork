import { openDB } from "idb";
import type { DBSchema } from "idb";
import type { CardSet } from "@/domain/card-set";
import type { Card } from "@/domain/card";

export type CardSetPlain = Pick<CardSet, "id" | "title" | "createdAt">;

interface MyDB extends DBSchema {
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

let db: ReturnType<typeof openDB<MyDB>>;

export const getDBInstance = async () => {
  if (db) {
    return db;
  }

  db = openDB<MyDB>("memorit", 1, {
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

      if (!oldVersion) {
        addCardSets();
        addCards();
      } else {
        const upgradeDBfromV1toV2 = () => {};
        // const upgradeDBfromV2toV3 = () => {};

        switch (oldVersion) {
          case 1:
            upgradeDBfromV1toV2();
            break;
          // falls through
          // case 2:
          //   upgradeDBfromV2toV3();
          //   break;
          default:
            console.error("unknown db version");
        }
      }
    },
  });
  // @ts-ignore
  // window.db = db;

  return db;
};
