import type { GetStudyCardsApi } from "@/application/get-study-cards";
import { getDBInstance } from "@/services/idb-storage";

// TODO: handle JSON errors
export const getStudyCardsApi: GetStudyCardsApi = async ({ cardSetId }) => {
  console.time("api/cards/getStudyCardsApi");
  const db = await getDBInstance();
  const result = await db.getAllFromIndex(
    "cards",
    "cardSetId_showAfter",
    IDBKeyRange.bound([cardSetId, ""], [cardSetId, new Date().toISOString()]),
    10
  );

  console.timeEnd("api/cards/getStudyCardsApi");
  return result;
};
