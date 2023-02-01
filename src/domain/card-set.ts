export type CardSet = {
  id: string;
  title: string;
};

export type CardSetInput = Pick<CardSet, "id" | "title">;

export const createCardSet = ({ id, title }: CardSetInput): CardSet => {
  return {
    id,
    title,
  };
};
