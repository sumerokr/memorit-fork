import type { Card } from "@/domain/card";
import type { CardSetV2 } from "../domain/card-set";

//#region driving adapters
//#region card sets
export type CreateCardSetUC = (title: CardSetV2["title"]) => Promise<void>;
export type GetCardSetsUC = (
  deps: {
    save: (response: Awaited<ReturnType<CardSetAPI["getAll"]>>) => void;
  },
  args?: (
    | {
        before: CardSetV2["id"];
        after?: never;
      }
    | {
        before?: never;
        after: CardSetV2["id"];
      }
    | {
        before?: never;
        after?: never;
      }
  ) & {
    query?: CardSetV2["title"];
  }
) => Promise<void>;
export type GetCardSetByIdUC = (id: CardSetV2["id"]) => Promise<void>;
export type UpdateCardSetUC = (
  id: CardSetV2["id"],
  data: Partial<Pick<CardSetV2, "title" | "updatedAt" | "updatedBy">>
) => Promise<void>;
export type DeleteCardSetUC = (id: CardSetV2["id"]) => Promise<void>;
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

export type GetCardsByCardSetIdUC = (id: CardSetV2["id"]) => Promise<void>;
export type GetStudyCardsUC = (id: CardSetV2["id"]) => Promise<void>;
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
  save: (cardSet: CardSetV2) => Promise<void>;
  getAll: (
    args?: (
      | {
          before: CardSetV2["id"];
          after?: never;
        }
      | {
          before?: never;
          after: CardSetV2["id"];
        }
      | {
          before?: never;
          after?: never;
        }
    ) & {
      query?: CardSetV2["title"];
    }
  ) => Promise<{
    data: (CardSetV2 & {
      cardsCount: number;
      cardsToStudyCount: number;
    })[];
    before?: CardSetV2["id"];
    after?: CardSetV2["id"];
  }>;
  getById: (id: CardSetV2["id"]) => Promise<
    CardSetV2 & {
      cardsCount: number;
      cardsToStudyCount: number;
    }
  >;
  update: (
    id: CardSetV2["id"],
    data: Partial<Pick<CardSetV2, "title" | "updatedAt" | "updatedBy">>
  ) => Promise<void>;
  delete: (id: CardSetV2["id"]) => Promise<void>;
};

export type CardSetStorage = {
  save: (cardSet: CardSetV2) => void;
  update: (id: CardSetV2["id"], data: Partial<Omit<CardSetV2, "id">>) => void;
  delete: (id: CardSetV2["id"]) => void;
};
//#endregion

//#region cards
export type CardsAPI = {
  save: (card: Card) => Promise<void>;
  getAllByCardSetId: (
    id: CardSetV2["id"],
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
  getStudyCards: (id: CardSetV2["id"]) => Promise<Card[]>;
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
