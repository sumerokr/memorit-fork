import type { CardSet } from "./card-set";

export type Card = {
  id: string;
  front: string;
  back: string;
  cardSetId: CardSet["id"];
  progress: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
  createdAt: string;
  showAfter: string;
};

export const createCard = ({
  id,
  front,
  back,
  cardSetId,
  createdAt,
}: Pick<Card, "id" | "front" | "back" | "cardSetId" | "createdAt">): Card => {
  const progress = 0;
  const dateCreatedAt = new Date(createdAt);
  const laterTS = dateCreatedAt.setDate(dateCreatedAt.getDate() + 1);
  const showAfter = new Date(laterTS).toISOString();
  return {
    id,
    front,
    back,
    cardSetId,
    progress,
    createdAt,
    showAfter,
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
  const daysAfter = Math.pow(progress, 1);
  const laterTS = dateNow.setDate(dateNow.getDate() + daysAfter);
  const showAfter = new Date(laterTS).toISOString();
  return {
    progress,
    showAfter,
  };
};
