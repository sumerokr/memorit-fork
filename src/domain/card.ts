import type { CardSet } from "./card-set";
import type { Entity } from "./entity";

export type Card = {
  id: string;
  front: string;
  back: string;
  cardSetId: CardSet["id"];
  progress: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
  createdAt: string;
  showAfter: string;
};

export type CardV2 = {
  front: string;
  back: string;
  cardSetId: CardSet["id"];
  progress: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
  showAfter: string;
  _v: 2;
} & Entity;

export const toV2 = (card: Card): CardV2 => {
  return structuredClone({
    ...card,
    createdBy: "",
    updatedAt: card.createdAt,
    updatedBy: "",
    _v: 2,
  });
};

export const createCard = ({
  id,
  front,
  back,
  cardSetId,
  createdAt,
  createdBy,
}: Pick<
  CardV2,
  "id" | "front" | "back" | "cardSetId" | "createdAt" | "createdBy"
>): CardV2 => {
  const progress = 0;
  return {
    id,
    front,
    back,
    cardSetId,
    progress,
    createdAt,
    createdBy,
    updatedAt: createdAt,
    updatedBy: createdBy,
    showAfter: createdAt,
    _v: 2,
  };
};

export const updateProgress = ({
  progress,
  now,
}: {
  progress: Card["progress"];
  now: string;
}): Pick<Card, "progress" | "showAfter"> => {
  const dateNow = new Date(now);
  const daysAfter = Math.pow(progress, 2);
  const laterTS = dateNow.setDate(dateNow.getDate() + daysAfter);
  const showAfter = new Date(laterTS).toISOString();
  return {
    progress,
    showAfter,
  };
};
