import { createCardSet as _createCardSet } from "@/domain/card-set";
import type { createCardSetUC } from "./ports";

export const createCardSet: createCardSetUC = async (
  { id, title },
  { cardSetAPI, cardSetStorage }
) => {
  const cardSet = _createCardSet({ id, title });
  await cardSetAPI.save(cardSet);
  cardSetStorage.save(cardSet);
};
