export type CardSet = {
  id: string;
  title: string;
  createdAt: string;
};

export type CardSetView = {
  id: string;
  title: string;
  cardsCount: number;
};

export const createCardSet = ({ id, title, createdAt }: CardSet): CardSet => {
  return {
    id,
    title,
    createdAt,
  };
};

export const updateCardSet = ({ id, title, createdAt }: CardSet): CardSet => {
  return {
    id,
    title,
    createdAt,
  };
};
