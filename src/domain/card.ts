import type { Entity } from "./entity";
import type { CardSet } from "./card-set";

export type Card = Entity & {
  id: string;
  front: string;
  back: string;
  cardSetId: CardSet["id"];
};

export const createCard = ({
  id,
  front,
  back,
  cardSetId,
  createdAt,
  createdBy,
}: Pick<
  Card,
  "id" | "front" | "back" | "cardSetId" | "createdAt" | "createdBy"
>): Card => {
  return {
    id,
    front,
    back,
    cardSetId,
    createdAt,
    createdBy,
    updatedAt: createdAt,
    updatedBy: createdBy,
  };
};
