import { ref, computed } from "vue";
import type { CardsStorage } from "@/application/ports";
import type { Card } from "@/domain/card";
import type { CardSet } from "@/domain/card-set";

// TODO: make Card[] readonly
export const cards = ref<Card[]>([]);
export const cardsByCardSetId = computed(() => {
  return cards.value.reduce<Record<CardSet["id"], Card[]>>((acc, card) => {
    if (!Array.isArray(acc[card.cardSetId])) {
      acc[card.cardSetId] = [];
    }
    acc[card.cardSetId].push(card);
    return acc;
  }, {});
});

export const cardsStorage: CardsStorage = {
  save: (card) => {
    cards.value.push(card);
  },
  set: (_cards) => {
    cards.value = _cards;
  },
  update: (card) => {
    const index = cards.value.findIndex((_card) => _card.id === card.id);
    cards.value.splice(index, 1, card);
  },
  getById: (id: Card["id"]) => {
    return cards.value.find((_card) => _card.id === id);
  },
};
