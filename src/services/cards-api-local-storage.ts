import type { CardsAPI } from "@/application/ports";
import type { Card } from "@/domain/card";
import type { CardSet } from "@/domain/card-set";

const localStorageKey = "memorit/cards";

const delay = (ms: number = Math.random() * 1000) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const cardsAPI: CardsAPI = {
  saveByCardSetId: async ({ cardSetId, card }) => {
    await delay();
    const data = localStorage.getItem(localStorageKey);
    // TODO: handle errors
    const cardsByCardSetId = JSON.parse(data ?? "{}") as Record<
      CardSet["id"],
      Card[]
    >;
    if (!cardsByCardSetId[cardSetId]) {
      cardsByCardSetId[cardSetId] = [];
    }
    cardsByCardSetId[cardSetId].push(card);
    // TODO: handle errors
    localStorage.setItem(localStorageKey, JSON.stringify(cardsByCardSetId));
  },
  getAllByCardSetId: async (cardSetId) => {
    await delay();
    const data = localStorage.getItem(localStorageKey);
    // TODO: handle errors
    const cardsByCardSetId = JSON.parse(data ?? "{}") as Record<
      CardSet["id"],
      Card[]
    >;
    // TODO: shameless fallback
    return cardsByCardSetId[cardSetId] ?? [];
  },
  update: async (card: Card) => {
    await delay();
    const data = localStorage.getItem(localStorageKey);
    // TODO: handle errors
    const cardsByCardSetId = JSON.parse(data ?? "{}") as Record<
      CardSet["id"],
      Card[]
    >;
    // REFACTOR!
    const oldCard = Object.values(cardsByCardSetId)
      .flat()
      .find((_card) => _card.id === card.id);
    if (!oldCard) {
      return;
    }
    Object.assign(oldCard, card);
    // TODO: shameless fallback
    localStorage.setItem(localStorageKey, JSON.stringify(cardsByCardSetId));
  },
};
