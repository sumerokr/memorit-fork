import type { Entity } from "./entity";

export type CardSet = Entity & {
  id: string;
  title: string;
};

export const createCardSet = ({
  id,
  title,
  createdAt,
  createdBy,
}: Pick<CardSet, "id" | "title" | "createdAt" | "createdBy">): CardSet => {
  return {
    id,
    title,
    createdAt,
    createdBy,
    updatedAt: createdAt,
    updatedBy: createdBy,
  };
};
