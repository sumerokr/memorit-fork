import type { CardSetAPI } from "@/application/ports";
import type { CardSet } from "@/domain/card-set";
import type { Card } from "@/domain/card";
import countBy from "lodash/countBy";

type CardSetPlain = Pick<CardSet, "id" | "title" | "createdAt">;

const localStorageCardSetsKey = "memorit/card-sets";
const localStorageCardsKey = "memorit/cards";

const cardSetsPlainRaw = localStorage.getItem(localStorageCardSetsKey);
const cardSetsPlain = JSON.parse(cardSetsPlainRaw ?? "[]") as CardSetPlain[];

const cardsRaw = localStorage.getItem(localStorageCardsKey);
const cards = JSON.parse(cardsRaw ?? "[]") as Card[];

const CardSetPlainToCardSet = (cardSetPlain: CardSetPlain): CardSet => {
  const cardsCountByCardSetId = countBy(cards, "cardSetId");
  return {
    ...cardSetPlain,
    cardsCount: cardsCountByCardSetId[cardSetPlain.id] ?? 0,
  };
};
const CardSetToCardSetPlain = (cardSet: CardSet): CardSetPlain => {
  const { id, title, createdAt } = cardSet;
  return { id, title, createdAt };
};

const delay = (ms: number = Math.max(Math.random() * 600, 100)) =>
  new Promise((resolve) => setTimeout(resolve, ms));

// TODO: handle JSON errors
export const cardSetAPI: CardSetAPI = {
  save: async (cardSet) => {
    await delay();
    const cardSetPlain = CardSetToCardSetPlain(cardSet);
    cardSetsPlain.push(structuredClone(cardSetPlain));
    localStorage.setItem(
      localStorageCardSetsKey,
      JSON.stringify(cardSetsPlain)
    );
  },

  getAll: async () => {
    await delay();
    const cardSets = cardSetsPlain.map(CardSetPlainToCardSet);
    return structuredClone(cardSets).reverse();
  },

  getById: async (id) => {
    await delay();
    await delay();
    await delay();
    const cardSetPlain = cardSetsPlain.find(
      (_cardSetPlain) => _cardSetPlain.id === id
    );
    if (cardSetPlain) {
      const cardSet = CardSetPlainToCardSet(cardSetPlain);
      return structuredClone(cardSet);
    }
    throw Error("cardSet not found");
  },

  delete: async (id) => {
    // await delay();
    // const index = cardSets.findIndex((_cardSet) => _cardSet.id === id);
    // cardSets.splice(index, 1);
    // localStorage.setItem(localStorageKey, JSON.stringify(cardSets));
  },

  update: async (cardSet) => {
    // await delay();
    // const index = cardSets.findIndex((_cardSet) => _cardSet.id === cardSet.id);
    // cardSets.splice(index, 1, structuredClone(cardSet));
    // localStorage.setItem(localStorageKey, JSON.stringify(cardSets));
  },
};
