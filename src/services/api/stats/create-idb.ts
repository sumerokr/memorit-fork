import type { CreateStatApi } from "@/application/create-stat";
import { getDBInstance } from "@/services/idb-storage";

// TODO: handle JSON errors
export const createStatApi: CreateStatApi = async ({ stat }) => {
  console.time("api/stats/createStatApi");
  const db = await getDBInstance();
  await db.add("stats", stat);
  console.timeEnd("api/stats/createStatApi");
  return stat;
};
