import type { Card } from "@/domain/card";
import type { CardSetV2 } from "../domain/card-set";

//#region driving adapters

//#region cards
export type CreateCardUC = ({
  front,
  back,
  cardSetId,
}: Pick<Card, "front" | "back" | "cardSetId">) => Promise<void>;

export type DeleteCardUC = (id: Card["id"]) => Promise<void>;

export type GetStudyCardsUC = (id: CardSetV2["id"]) => Promise<void>;

//#endregion

//#region driven adapters

//#region cards
export type CardsAPI = {
  getStudyCards: (id: CardSetV2["id"]) => Promise<Card[]>;
  delete: (id: Card["id"]) => Promise<void>;
};
//#endregion

//#region notification
export interface NotificationService {
  notify: (message: string) => void;
  error: (error: unknown) => void;
}
//#endregion
