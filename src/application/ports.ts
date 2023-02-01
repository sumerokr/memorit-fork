import type { CardSetInput, CardSet } from "../domain/card-set";

//#region driving adapters
export type createCardSetUC = (
  cardSetInput: CardSetInput,
  dependencies: { cardSetAPI: CardSetAPI; cardSetStorage: CardSetStorage }
) => Promise<void>;
//#endregion

//#region driven adapters
export type CardSetAPI = {
  save: (cardSet: CardSet) => Promise<void>;
};

export type CardSetStorage = {
  save: (cardSet: CardSet) => Promise<void>;
};
//#endregion
