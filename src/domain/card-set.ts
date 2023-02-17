export type CardSet = {
  id: string;
  title: string;
  createdAt: string;
  cardsCount: number;
};

export type CardSetView = {
  id: string;
  title: string;
  cardsCount: number;
};

export const createCardSet = ({
  id,
  title,
  createdAt,
}: Pick<CardSet, "id" | "title" | "createdAt">): CardSet => {
  return {
    id,
    title,
    createdAt,
    cardsCount: 0,
  };
};

export const updateCardSet = ({ id, title, createdAt }: CardSet): CardSet => {
  return {
    id,
    title,
    createdAt,
    cardsCount: 0,
  };
};
