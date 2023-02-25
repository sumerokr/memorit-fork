<script setup lang="ts">
import type { Card } from "@/domain/card";
import type { CardSet } from "@/domain/card-set";
import { createCardSet } from "@/domain/card-set";
import { faker } from "@faker-js/faker";
import { nanoid } from "nanoid";
import flatten from "lodash/flatten";
import { deleteDB } from "idb";
import { getDBInstance } from "@/services/idb-storage";

const onSeed = async (options: any) => {
  const [[cardSetMin, cardSetMax], [cardsMin, cardsMax]] = options;
  const cardSets = new Array(
    faker.datatype.number({
      min: cardSetMin,
      max: cardSetMax,
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
          min: cardsMin,
          max: cardsMax,
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

  const db = await getDBInstance();
  console.time("create card-sets");
  const cardSetsTransaction = db.transaction("card-sets", "readwrite");
  const cardSetsPromises = cardSets.map((cardSet) =>
    cardSetsTransaction.store.add(cardSet)
  );
  await Promise.all([...cardSetsPromises, cardSetsTransaction.done]);
  console.timeEnd("create card-sets");

  console.time("create cards");
  const cardsTransaction = db.transaction("cards", "readwrite");
  const cardsPromises = cards.map((card) => cardsTransaction.store.add(card));
  await Promise.all([...cardsPromises, cardsTransaction.done]);
  console.timeEnd("create cards");

  alert("Dummy data added");
};

const onDelete = async () => {
  await deleteDB("memorit", {
    blocked: () => {
      alert("Please refresh the page now");
    },
  });
  alert("Dummy data deleted");
};
</script>

<template>
  <div class="flex-grow bg-neutral-100 p-4">
    <p class="mb-4">
      <RouterLink :to="{ name: 'sets' }" class="text-indigo-500"
        ><span class="inline-block rotate-180">➜</span> Back to card
        sets</RouterLink
      >
    </p>
    <p>Add 5-10 card sets, 5-50 cards each</p>
    <p class="mb-4">
      <button
        class="inline-flex gap-2 px-4 py-2 items-center bg-indigo-100 rounded-2xl justify-center"
        type="button"
        @click="
          onSeed([
            [5, 10],
            [5, 50],
          ])
        "
      >
        Add data
      </button>
    </p>
    <p>Add 50-100 card sets, 50-500 cards each</p>
    <p>
      <button
        class="inline-flex gap-2 px-4 py-2 items-center bg-indigo-100 rounded-2xl justify-center"
        type="button"
        @click="
          onSeed([
            [50, 100],
            [50, 500],
          ])
        "
      >
        Add data
      </button>
    </p>
    <hr class="border-t my-4" />
    <button
      class="inline-flex gap-2 px-4 py-2 items-center bg-red-100 rounded-2xl justify-center"
      type="button"
      @click="onDelete"
    >
      Delete data
    </button>
  </div>
</template>
