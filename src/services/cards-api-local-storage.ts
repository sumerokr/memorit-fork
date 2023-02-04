import type { CardsAPI } from "@/application/ports";
import type { Card } from "@/domain/card";

const localStorageKey = "memorit/cards";

const delay = (ms: number = Math.random() * 1000) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const cardsAPI: CardsAPI = {
  save: async (card) => {
    await delay();
    const data = localStorage.getItem(localStorageKey);
    // TODO: handle errors
    const cards = JSON.parse(data ?? "[]") as Card[];
    cards.push(card);
    // TODO: handle errors
    localStorage.setItem(localStorageKey, JSON.stringify(cards));
  },
};
