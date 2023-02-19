import type { CardsAPI } from "@/application/ports";
import type { Card } from "@/domain/card";
import { delay } from "@/utils";

const localStorageKey = "memorit/cards";

const data = localStorage.getItem(localStorageKey);
const cards = JSON.parse(data ?? "[]") as Card[];

// TODO: handle JSON errors
// build index by cardSet id
export const cardsAPI: CardsAPI = {
  save: async (card) => {
    await delay();
    cards.push(structuredClone(card));
    // TODO: handle errors
    localStorage.setItem(localStorageKey, JSON.stringify(cards));
  },
  getAllByCardSetId: async (cardSetId) => {
    await delay();
    return structuredClone(
      cards.filter((card) => card.cardSetId === cardSetId)
    ).reverse();
  },
  update: async (card: Card) => {
    await delay();
    const index = cards.findIndex((_card) => _card.id === card.id);
    cards.splice(index, 1, structuredClone(card));
    localStorage.setItem(localStorageKey, JSON.stringify(cards));
  },
  delete: async (id) => {
    await delay();
    const index = cards.findIndex((_card) => _card.id === id);
    cards.splice(index, 1);
    localStorage.setItem(localStorageKey, JSON.stringify(cards));
  },
};
