<script setup lang="ts">
import { deleteDB } from "idb";
import { importCardSetUC } from "@/application/import-card-set";
import { createCardSetUC } from "@/application/create-card-set";
import { createCardUC } from "@/application/create-card";
import IconButton from "@/components/IconButton.vue";
import f1 from "@/data/f1";
import b1 from "@/data/b1";

const _faker = () => import("@faker-js/faker");

//#region ready sets
const setsToImport = [f1, b1];
//#endregion

const handleSeedDB = async (options: number[][]) => {
  const [[cardSetMin, cardSetMax], [cardsMin, cardsMax]] = options;
  const { faker } = await _faker();

  const cardSetsCount = faker.datatype.number({
    min: cardSetMin,
    max: cardSetMax,
  });

  const sets = Array.from({ length: cardSetsCount }, () => {
    const cardCount = faker.datatype.number({
      min: cardsMin,
      max: cardsMax,
    });

    return {
      title: faker.random.words(
        faker.datatype.number({
          min: 1,
          max: 3,
        })
      ),
      items: Array.from({ length: cardCount }, () => ({
        front: faker.random.words(
          faker.datatype.number({
            min: 1,
            max: 5,
          })
        ),
        back: faker.random.words(
          faker.datatype.number({
            min: 1,
            max: 5,
          })
        ),
      })),
    };
  });

  for (const set of sets) {
    await importCardSetUC(set);
  }

  alert("Dummy data added");
};

const handleDeleteDB = async () => {
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

    <h2 class="text-xl font-medium">Dummy data</h2>
    <ul class="divide-y">
      <li class="flex items-start justify-between gap-4 py-4">
        <span class="py-2">Add 5-10 sets, 5-50 cards each</span>
        <IconButton
          icon="add"
          class="-my-1 bg-green-100 shadow-md"
          @click="
            handleSeedDB([
              [5, 10],
              [5, 50],
            ])
          "
        />
      </li>
      <li class="flex items-start justify-between gap-4 py-4">
        <span class="py-2">Add 50-100 sets, 50-500 cards each</span>
        <IconButton
          icon="add"
          class="-my-1 bg-green-100 shadow-md"
          @click="
            handleSeedDB([
              [50, 100],
              [50, 500],
            ])
          "
        />
      </li>
    </ul>

    <h2 class="mt-6 text-xl font-medium">Ready sets</h2>
    <ul v-if="setsToImport.length" class="divide-y">
      <li
        v-for="{ title, items } in setsToImport"
        :key="title"
        class="flex items-start justify-between gap-4 py-4"
      >
        <span class="py-2"
          >{{ title }}
          <span class="text-xs opacity-60"
            >({{ items.length }} cards)</span
          ></span
        >
        <IconButton
          icon="add"
          class="-my-1 shadow-md bg-green-100 disabled:opacity-40"
          @click="importCardSetUC({ title, items })"
        />
      </li>
    </ul>
    <hr class="border-t my-4" />

    <ul class="divide-y">
      <li class="flex items-start justify-between gap-4 py-4">
        <span class="py-2">Delete ALL data</span>
        <IconButton
          icon="delete"
          class="-my-1 bg-red-100 shadow-md"
          @click="handleDeleteDB"
        />
      </li>
    </ul>
  </div>
</template>
