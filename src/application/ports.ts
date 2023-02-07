import type { Card } from "@/domain/card";
import type { CardSet } from "../domain/card-set";

//#region driving adapters
export type CreateCardSetUC = (title: CardSet["title"]) => Promise<void>;
export type GetCardSetsUC = () => Promise<void>;
export type GetCardSetByIdUC = (id: CardSet["id"]) => Promise<void>;
export type UpdateCardSetUC = (cardSet: CardSet) => Promise<void>;
export type DeleteCardSetUC = (id: CardSet["id"]) => Promise<void>;
export type ToggleCardSetUC = (id: CardSet["id"]) => Promise<void>;

export type CreateCardUC = ({
  front,
  back,
  cardSetId,
}: Pick<Card, "front" | "back" | "cardSetId">) => Promise<void>;
export type GetCardsByCardSetIdUC = (id: CardSet["id"]) => Promise<void>;
export type UpdateCardStatusUC = ({ id, progress }: Card) => Promise<void>;
//#endregion

//#region driven adapters

//#region cardSets
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
//#endregion

//#region cards
export type CardsAPI = {
  save: (card: Card) => Promise<void>;
  getAllByCardSetId: (id: CardSet["id"]) => Promise<Card[]>;
  update: (card: Card) => Promise<void>;
};

export type CardsStorage = {
  save: (card: Card) => void;
  set: (cards: Card[]) => void;
  update: (card: Card) => void;
  getById: (id: Card["id"]) => Card | undefined;
};
//#endregion

export interface NotificationService {
  notify: (message: string) => void;
}
//#endregion
