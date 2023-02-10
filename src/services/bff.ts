import { cardSetsRepository } from "@/services/card-sets-db-local-storage";
import { cardsRepository } from "@/services/cards-db-local-storage";
import countBy from "lodash/countBy";
import { delay } from "@/utils/index";
import type { CardSet, CardSetView } from "@/domain/card-set";

export const bff = {
  getCardSetsView: async (): Promise<CardSetView[]> => {
    const promises = Promise.all([
      cardSetsRepository.getAll(),
      cardsRepository.getAll(),
    ]);

    const [cardSets, cards] = await promises;

    const cardsCountByCardSetId = countBy(cards, "cardSetId");

    await delay();

    return cardSets.map(({ id, title }) => {
      return {
        id,
        title,
        cardsCount: cardsCountByCardSetId[id] ?? 0,
      };
    });
  },

  createCardSet: async (cardSet: CardSet) => {
    cardSetsRepository.add(cardSet);
  },
};
