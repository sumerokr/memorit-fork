import type { Entity } from "./entity";

export type CardSet = {
  id: string;
  title: string;
  createdAt: string;
  cardsCount: number;
  cardsToStudyCount: number;
};

export type CardSetV2 = {
  title: string;
  _v: 2;
} & Entity;

export const createCardSet = ({
  id,
  title,
  createdAt,
}: Pick<CardSetV2, "id" | "title" | "createdAt">): CardSetV2 => {
  return {
    id,
    title,
    createdAt,
    createdBy: "",
    updatedAt: createdAt,
    updatedBy: "",
    _v: 2,
  };
};
