<script setup lang="ts">
import type { Card } from "@/domain/card";
import type { CardSet } from "@/domain/card-set";
import { createCardSet } from "@/domain/card-set";
import { faker } from "@faker-js/faker";
import { nanoid } from "nanoid";
import flatten from "lodash/flatten";

const cardSetsKey = "memorit/card-sets";
const cardsKey = "memorit/cards";

const cardSets = new Array(5).fill(null).map<CardSet>(() =>
  createCardSet({
    id: nanoid(),
    title: faker.random.words(2),
    createdAt: faker.date.recent(30).toISOString(),
  })
);

const cards = flatten(
  cardSets.map((cardSet) => {
    return new Array(15).fill(null).map<Card>(() => ({
      id: nanoid(),
      front: faker.random.words(2),
      back: faker.random.words(2),
      cardSetId: cardSet.id,
      progress: faker.datatype.number({
        min: 1,
        max: 10,
      }) as Card["progress"],
      createdAt: faker.date.recent(30).toISOString(),
      showAfter: faker.date
        .between(
          faker.date.recent(10).toISOString(),
          faker.date.soon(10).toISOString()
        )
        .toISOString(),
    }));
  })
);

localStorage.setItem(cardSetsKey, JSON.stringify(cardSets));
localStorage.setItem(cardsKey, JSON.stringify(cards));
</script>

<template>
  <div>seed</div>
</template>
