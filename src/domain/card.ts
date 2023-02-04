import type { CardSet } from "./card-set";

export type Card = {
  id: string;
  front: string;
  back: string;
  cardSetId: CardSet["id"];
  progress: 1 | 2 | 3 | 5 | 8 | 13 | 21;
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
  const progress = 1;
  const dateCreatedAt = new Date(createdAt);
  const laterTS = dateCreatedAt.setDate(dateCreatedAt.getDate() + progress);
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
