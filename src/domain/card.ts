import type { CardSet } from "./card-set";

export type Card = {
  id: string;
  front: string;
  back: string;
  cardSetId: CardSet["id"];
  progress: 0 | 1 | 2 | 3 | 5 | 8 | 13 | 21;
  showAfter: string;
};

export const createCard = ({
  front,
  back,
  cardSetId,
  showAfter,
}: Pick<Card, "front" | "back" | "cardSetId" | "showAfter">): Card => {
  return {
    id: "abc",
    front,
    back,
    cardSetId,
    progress: 0,
    showAfter,
  };
};
