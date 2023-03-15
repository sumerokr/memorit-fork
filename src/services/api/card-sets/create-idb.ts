// TODO: ensure that put only updates

import type { apiCreateCardSet } from "@/application/create-card-set";
import { getDBInstance } from "@/services/idb-storage";

// TODO: handle JSON errors
export const createCardSetIdb: apiCreateCardSet = async ({ cardSet }) => {
  console.time("api/card-sets/idbCreateCardSet");
  const db = await getDBInstance();
  await db.add("card-sets", cardSet);
  console.timeEnd("api/card-sets/idbCreateCardSet");
};
