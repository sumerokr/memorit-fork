import type { Card } from "@/domain/card";
import type { CardSetV2 } from "../domain/card-set";

//#region driving adapters

//#region cards
export type CreateCardUC = ({
  front,
  back,
  cardSetId,
}: Pick<Card, "front" | "back" | "cardSetId">) => Promise<void>;
export type GetCardByIdUC = (id: Card["id"]) => Promise<void>;

export type DeleteCardUC = (id: Card["id"]) => Promise<void>;

export type GetCardsByCardSetIdUC = (id: CardSetV2["id"]) => Promise<void>;
export type GetStudyCardsUC = (id: CardSetV2["id"]) => Promise<void>;

//#endregion

export type GetCardSetsViewUC = () => Promise<void>;

//#region driven adapters

//#region cardSets
export type CardSetAPI = {
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
};
//#endregion

//#region cards
export type CardsAPI = {
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
