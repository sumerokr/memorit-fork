import { readonly, ref } from "vue";
import type { CardsStorage } from "@/application/ports";
import type { Card } from "@/domain/card";

// TODO: move the store itself to a separate file
const cards = ref<Card[]>([]);
const roCards = readonly(cards);

export { roCards as cards };

export const cardsStorage: CardsStorage = {
  save: (card) => {
    cards.value.push(card);
  },
};
