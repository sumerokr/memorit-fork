import type { Card } from "@/domain/card";
import type { CardSet } from "../domain/card-set";

//#region driving adapters
//#region card sets
export type CreateCardSetUC = (title: CardSet["title"]) => Promise<void>;
export type GetCardSetsUC = (
  deps: {
    save: (response: Awaited<ReturnType<CardSetAPI["getAll"]>>) => void;
  },
  args?:
    | { before: CardSet["id"]; after?: never }
    | { before?: never; after: CardSet["id"] }
) => Promise<void>;
export type GetCardSetByIdUC = (id: CardSet["id"]) => Promise<void>;
export type UpdateCardSetUC = (
  id: CardSet["id"],
  data: Partial<Omit<CardSet, "id">>
) => Promise<void>;
export type DeleteCardSetUC = (id: CardSet["id"]) => Promise<void>;
export type ToggleCardSetUC = (id: CardSet["id"]) => Promise<void>;
//#endregion

//#region cards
export type CreateCardUC = ({
  front,
  back,
  cardSetId,
}: Pick<Card, "front" | "back" | "cardSetId">) => Promise<void>;
export type GetCardByIdUC = (id: Card["id"]) => Promise<void>;
export type UpdateCardUC = (
  id: Card["id"],
  data: Partial<Omit<Card, "id">>
) => Promise<void>;
export type DeleteCardUC = (id: Card["id"]) => Promise<void>;

export type GetCardsByCardSetIdUC = (id: CardSet["id"]) => Promise<void>;
export type GetStudyCardsUC = (id: CardSet["id"]) => Promise<void>;
export type UpdateCardStatusUC = ({
  id,
  progress,
}: Pick<Card, "id" | "progress">) => Promise<void>;

export type GetCardSetsViewUC = () => Promise<void>;
//#endregion
//#endregion

//#region driven adapters

//#region cardSets
export type CardSetAPI = {
  save: (cardSet: CardSet) => Promise<void>;
  getAll: (
    args?: (
      | {
          before: CardSet["id"];
          after?: never;
        }
      | {
          before?: never;
          after: CardSet["id"];
        }
      | {
          before?: never;
          after?: never;
        }
    ) & {
      query?: CardSet["title"];
    }
  ) => Promise<{
    data: CardSet[];
    before?: CardSet["id"];
    after?: CardSet["id"];
  }>;
  getById: (id: CardSet["id"]) => Promise<CardSet>;
  update: (
    id: CardSet["id"],
    data: Partial<Omit<CardSet, "id">>
  ) => Promise<void>;
  delete: (id: CardSet["id"]) => Promise<void>;
};

export type CardSetStorage = {
  save: (cardSet: CardSet) => void;
  set: (cardSets: CardSet[]) => void;
  update: (id: CardSet["id"], data: Partial<Omit<CardSet, "id">>) => void;
  delete: (id: CardSet["id"]) => void;
  getById: (id: CardSet["id"]) => CardSet | undefined;
};

export type CardSetsViewStorage = {
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
  getAllByCardSetId: (
    id: CardSet["id"],
    args?: (
      | {
          before: Card["id"];
          after?: never;
        }
      | {
          before?: never;
          after: Card["id"];
        }
      | {
          before?: never;
          after?: never;
        }
    ) & {
      query?: Card["front"] | Card["back"];
    }
  ) => Promise<{
    data: Card[];
    before?: Card["id"];
    after?: Card["id"];
  }>;
  getById: (id: Card["id"]) => Promise<Card>;
  getStudyCards: (id: CardSet["id"]) => Promise<Card[]>;
  update: (id: Card["id"], data: Partial<Omit<Card, "id">>) => Promise<void>;
  delete: (id: Card["id"]) => Promise<void>;
};

export type CardsStorage = {
  save: (card: Card) => void;
  set: (cards: Card[]) => void;
  update: (id: Card["id"], data: Partial<Omit<Card, "id">>) => void;
  getById: (id: Card["id"]) => Card | undefined;
  delete: (id: Card["id"]) => void;
};
//#endregion

//#region notification
export interface NotificationService {
  notify: (message: string) => void;
  error: (error: unknown) => void;
}
//#endregion
