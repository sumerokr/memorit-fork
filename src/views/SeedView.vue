<script setup lang="ts">
import type { Card } from "@/domain/card";
import type { CardSet } from "@/domain/card-set";
import { createCardSet } from "@/domain/card-set";
import { faker } from "@faker-js/faker";
import { nanoid } from "nanoid";
import flatten from "lodash/flatten";
import { deleteDB } from "idb";

const cardSetsKey = "memorit/card-sets";
const cardsKey = "memorit/cards";

const onSeed = () => {
  const cardSets = new Array(
    faker.datatype.number({
      min: 5,
      max: 10,
    })
  )
    .fill(null)
    .map<CardSet>(() =>
      createCardSet({
        id: nanoid(),
        title: faker.random.words(
          faker.datatype.number({
            min: 1,
            max: 3,
          })
        ),
        createdAt: faker.date.recent(30).toISOString(),
      })
    );

  const cards = flatten(
    cardSets.map((cardSet) => {
      return new Array(
        faker.datatype.number({
          min: 5,
          max: 50,
        })
      )
        .fill(null)
        .map<Card>(() => ({
          id: nanoid(),
          front: faker.random.words(
            faker.datatype.number({
              min: 1,
              max: 5,
            })
          ),
          back: faker.random.words(2),
          cardSetId: cardSet.id,
          progress: faker.datatype.number({
            min: 0,
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
};

const onClear = () => {
  localStorage.clear();
};

const onDelete = () => {
  deleteDB("memorit", {
    blocked: () => {
      alert("cannot delet while connection is open!");
    },
  });
};
</script>

<template>
  <div style="padding: 1rem">
    <button type="button" @click="onSeed">Seed</button> ||
    <button type="button" @click="onClear">Clear</button> ||
    <button type="button" @click="onDelete">Delete</button>
  </div>
</template>
