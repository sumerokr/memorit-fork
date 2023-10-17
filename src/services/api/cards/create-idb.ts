import type { CreateCardApi } from "@/application/create-card";
import { getDBInstance } from "@/services/idb-storage";

// TODO: handle JSON errors
export const createCardApi: CreateCardApi = async ({ card }) => {
  console.time("api/card-sets/createCardSetApi");
  const db = await getDBInstance();
  await db.add("cards", card);
  console.timeEnd("api/card-sets/createCardSetApi");
  return card;
};
