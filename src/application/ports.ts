import type { CardSet } from "../domain/card-set";

//#region driving adapters
export type CreateCardSetUC = (title: CardSet["title"]) => Promise<void>;
export type GetCardSetsUC = () => Promise<void>;
export type GetCardSetByIdUC = (id: CardSet["id"]) => Promise<void>;
export type UpdateCardSetUC = (cardSet: CardSet) => Promise<void>;
export type DeleteCardSetUC = (id: CardSet["id"]) => Promise<void>;
export type ToggleCardSetUC = (id: CardSet["id"]) => Promise<void>;
//#endregion

//#region driven adapters
export type CardSetAPI = {
  save: (cardSet: CardSet) => Promise<void>;
  getAll: () => Promise<CardSet[]>;
  getById: (id: CardSet["id"]) => Promise<CardSet>;
  update: (cardSet: CardSet) => Promise<void>;
  delete: (id: CardSet["id"]) => Promise<void>;
};

export type CardSetStorage = {
  save: (cardSet: CardSet) => void;
  set: (cardSets: CardSet[]) => void;
  update: (cardSet: CardSet) => void;
  delete: (id: CardSet["id"]) => void;
  getById: (id: CardSet["id"]) => CardSet | undefined;
};

export interface NotificationService {
  notify: (message: string) => void;
}
//#endregion
