import type { GetStatApi } from "@/application/get-stat";
import { getDBInstance } from "@/services/idb-storage";

export const getStatApi: GetStatApi = async ({ cardId }) => {
  console.time("api/stats/getStatApi");
  const db = await getDBInstance();
  const stat = await db.getFromIndex("stats", "cardId", cardId);
  if (stat) {
    console.timeEnd("api/stats/getStatApi");
    return stat;
  }
  // TODO: handle error better
  throw new Error("api/stats/getStatApi");
};
