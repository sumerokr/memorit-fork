import type { CardsAPI } from "@/application/ports";
import { getDBInstance } from "./idb-storage";

// TODO: handle JSON errors
export const cardsAPI: CardsAPI = {
  save: async (card) => {
    const db = await getDBInstance();
    db.add("cards", card);
  },

  getAllByCardSetId: async (id) => {
    const db = await getDBInstance();
    const cards = await db.getAllFromIndex("cards", "cardSetId", id);
    return cards.sort((a, b) => {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    });
  },

  delete: async (id) => {
    const db = await getDBInstance();
    await db.delete("cards", id);
  },

  update: async (card) => {
    const db = await getDBInstance();
    await db.put("cards", card);
  },
};
