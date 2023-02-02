export type CardSet = {
  id: string;
  title: string;
  createdAt: string;
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
