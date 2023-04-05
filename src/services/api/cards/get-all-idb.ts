import type {
  GetCardSetsApi,
  GetCardSetsApiReturn,
} from "@/application/get-card-sets";
import { getDBInstance } from "@/services/idb-storage";
import type { CardSetV2 } from "@/domain/card-set";

// TODO: handle JSON errors
export const getAllCardsApi: GetCardsApi = async (args) => {
  console.time("api/cards/getAllCardsApi");

  console.timeEnd("api/cards/getAllCardsApi");
  return response;
};
