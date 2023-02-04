import { ref } from "vue";
import type { CardsStorage } from "@/application/ports";
import type { Card } from "@/domain/card";
import type { CardSet } from "@/domain/card-set";

// TODO: make Card[] readonly
export const cardsByCardSetId = ref<Record<CardSet["id"], Card[]>>({});

export const cardsStorage: CardsStorage = {
  saveByCardSetId: ({ cardSetId, card }) => {
    if (!cardsByCardSetId.value[cardSetId]) {
      cardsByCardSetId.value[cardSetId] = [];
    }
    cardsByCardSetId.value[cardSetId].push(card);
  },
  setByCardSetId: ({ cardSetId, cards }) => {
    cardsByCardSetId.value[cardSetId] = cards;
  },
};
