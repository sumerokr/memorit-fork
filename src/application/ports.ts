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
  saveByCardSetId: ({
    cardSetId,
    card,
  }: {
    cardSetId: CardSet["id"];
    card: Card;
  }) => Promise<void>;
  getAllByCardSetId: (id: CardSet["id"]) => Promise<Card[]>;
};

export type CardsStorage = {
  saveByCardSetId: ({
    cardSetId,
    card,
  }: {
    cardSetId: CardSet["id"];
    card: Card;
  }) => void;
  setByCardSetId: ({
    cardSetId,
    cards,
  }: {
    cardSetId: CardSet["id"];
    cards: Card[];
  }) => void;
};
//#endregion

export interface NotificationService {
  notify: (message: string) => void;
}
//#endregion
