import type { CreateCardSetApi } from "@/application/create-card-set";
import { getDBInstance } from "@/services/idb-storage";

// TODO: handle JSON errors
export const createCardSetApi: CreateCardSetApi = async ({ cardSet }) => {
  console.time("api/card-sets/createCardSetApi");
  const db = await getDBInstance();
  await db.add("card-sets", cardSet);
  console.timeEnd("api/card-sets/createCardSetApi");
};
