import type { CardSetAPI } from "@/application/ports";
import type { CardSet } from "@/domain/card-set";

const localStorageKey = "memorit/card-sets";

const delay = (ms: number = Math.random() * 1000) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const cardSetAPI: CardSetAPI = {
  save: async (cardSet) => {
    await delay();
    const data = localStorage.getItem(localStorageKey);
    // TODO: handle errors
    const cardSets = JSON.parse(data ?? "[]") as CardSet[];
    cardSets.push(cardSet);
    // TODO: handle errors
    localStorage.setItem(localStorageKey, JSON.stringify(cardSets));
  },
  getAll: async () => {
    await delay();
    const data = localStorage.getItem(localStorageKey);
    // TODO: handle errors
    return JSON.parse(data ?? "[]") as CardSet[];
  },
  getById: async (id) => {
    await delay();
    const data = localStorage.getItem(localStorageKey);
    // TODO: handle errors
    const cardSets = JSON.parse(data ?? "[]") as CardSet[];
    const cardSet = cardSets.find((_cardSet) => _cardSet.id === id);
    if (cardSet) {
      return cardSet;
    }
    throw Error("cardSet not found");
  },
  delete: async (id) => {
    await delay();
    const data = localStorage.getItem(localStorageKey);
    // TODO: handle errors
    const cardSets = JSON.parse(data ?? "[]") as CardSet[];
    const newCardSets = cardSets.filter((_cardSet) => _cardSet.id !== id);
    // TODO: handle errors
    localStorage.setItem(localStorageKey, JSON.stringify(newCardSets));
  },
  update: async (cardSet) => {
    await delay();
    const data = localStorage.getItem(localStorageKey);
    // TODO: handle errors
    const cardSets = JSON.parse(data ?? "[]") as CardSet[];
    // TODO: handle errors
    const index = cardSets.findIndex((_cardSet) => _cardSet.id === cardSet.id);
    cardSets.splice(index, 1, cardSet);
    localStorage.setItem(localStorageKey, JSON.stringify(cardSets));
  },
};
