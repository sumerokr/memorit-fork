import type { CreateCardSetApi } from "@/application/create-card-set";
import { getDBInstance } from "@/services/idb-storage";

// TODO: handle JSON errors
export const createCardSetApi: CreateCardSetApi = async ({ cardSet }) => {
  console.time("api/card-sets/createCardSetApi");
  const db = await getDBInstance();
  const savedCardSet = await db.add("card-sets", cardSet);
  console.log(
    "🚀 ~ file: create-idb.ts:9 ~ constcreateCardSetApi:CreateCardSetApi= ~ savedCardSet:",
    savedCardSet
  );
  console.timeEnd("api/card-sets/createCardSetApi");
  return savedCardSet;
};
