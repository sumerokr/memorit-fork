import { computed, readonly, ref } from "vue";
import type { CardSetStorage } from "@/application/ports";
import type { CardSet } from "@/domain/card-set";
import keyBy from "lodash/keyBy";

// TODO: move the store itself to a separate file
const cardSets = ref<CardSet[]>([]);
const readonlyCardSets = readonly(cardSets);
export const cardSetsById = computed(() => {
  return keyBy(cardSets.value, "id");
});

export { readonlyCardSets as cardSets };

export const cardSetStorage: CardSetStorage = {
  save: (cardSet) => {
    cardSets.value.push(cardSet);
  },
  set: (_cardSets) => {
    cardSets.value = _cardSets;
  },
  delete: (id) => {
    cardSets.value = cardSets.value.filter((_cardSet) => _cardSet.id !== id);
  },
  getById: (id) => {
    return cardSets.value.find((cardSet) => cardSet.id === id);
  },
  update: (cardSet) => {
    // TODO: the only one that mutates in place
    const index = cardSets.value.findIndex(
      (_cardSet) => _cardSet.id === cardSet.id
    );
    cardSets.value.splice(index, 1, cardSet);
  },
};
