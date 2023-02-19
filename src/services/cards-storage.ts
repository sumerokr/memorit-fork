import { ref, computed, readonly } from "vue";
import type { CardsStorage } from "@/application/ports";
import type { Card } from "@/domain/card";
import groupBy from "lodash/groupBy";

// TODO: make Card[] readonly
const cards = ref<Card[]>([]);
export const cardsByCardSetId = computed(() => {
  console.log("c:cardsByCardSetId");
  return groupBy(cards.value, "cardSetId");
});

const readonlyCards = readonly(cards);
export { readonlyCards as cards };

export const cardsStorage: CardsStorage = {
  save: (card) => {
    cards.value.push(card);
  },
  set: (_cards) => {
    console.log("set", cards);
    cards.value = _cards;
  },
  update: (card) => {
    const index = cards.value.findIndex((_card) => _card.id === card.id);
    cards.value.splice(index, 1, card);
  },
  getById: (id: Card["id"]) => {
    return cards.value.find((_card) => _card.id === id);
  },
  delete: (id) => {
    cards.value = cards.value.filter((_card) => _card.id !== id);
  },
};
