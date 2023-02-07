import type { CardSetAPI } from "@/application/ports";
import type { CardSet } from "@/domain/card-set";

const localStorageKey = "memorit/card-sets";

const data = localStorage.getItem(localStorageKey);
const cardSets = JSON.parse(data ?? "[]") as CardSet[];

const delay = (ms: number = Math.max(Math.random() * 600, 100)) =>
  new Promise((resolve) => setTimeout(resolve, ms));

// TODO: handle JSON errors
export const cardSetAPI: CardSetAPI = {
  save: async (cardSet) => {
    await delay();
    cardSets.push(structuredClone(cardSet));
    localStorage.setItem(localStorageKey, JSON.stringify(cardSets));
  },
  getAll: async () => {
    await delay();
    return structuredClone(cardSets);
  },
  getById: async (id) => {
    await delay();
    const cardSet = cardSets.find((_cardSet) => _cardSet.id === id);
    if (cardSet) {
      return structuredClone(cardSet);
    }
    throw Error("cardSet not found");
  },
  delete: async (id) => {
    await delay();
    const index = cardSets.findIndex((_cardSet) => _cardSet.id === id);
    cardSets.splice(index, 1);
    localStorage.setItem(localStorageKey, JSON.stringify(cardSets));
  },
  update: async (cardSet) => {
    await delay();
    const index = cardSets.findIndex((_cardSet) => _cardSet.id === cardSet.id);
    cardSets.splice(index, 1, structuredClone(cardSet));
    localStorage.setItem(localStorageKey, JSON.stringify(cardSets));
  },
};
