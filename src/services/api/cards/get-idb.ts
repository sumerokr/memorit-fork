import type { GetCardApi } from "@/application/get-card";
import { getDBInstance } from "@/services/idb-storage";

export const getCardApi: GetCardApi = async ({ id }) => {
  console.time("api/cards/getCardApi");
  const db = await getDBInstance();
  const card = await db.get("cards", id);
  if (card) {
    console.timeEnd("api/cards/getCardApi");
    return card;
  }
  // TODO: handle error better
  throw new Error("api/cards/getCardApi");
};
