import { ref, computed, readonly } from "vue";
import type { CardsStorage } from "@/application/ports";
import type { Card } from "@/domain/card";
import groupBy from "lodash/groupBy";

// TODO: make Card[] readonly
const cards = ref<Card[]>([]);
export const cardsByCardSetId = computed(() => {
  return groupBy(cards.value, "cardSetId");
});

const readonlyCards = readonly(cards);
export { readonlyCards as cards };

export const cardsStorage: CardsStorage = {
  save: (card) => {
    cards.value.push(card);
  },
  set: (_cards) => {
    cards.value = _cards;
  },
  update: (id, data) => {
    const index = cards.value.findIndex((card) => card.id === id);
    cards.value[index] = {
      ...cards.value[index],
      ...structuredClone(data),
    };
  },
  getById: (id: Card["id"]) => {
    return cards.value.find((_card) => _card.id === id);
  },
  delete: (id) => {
    cards.value = cards.value.filter((_card) => _card.id !== id);
  },
};
