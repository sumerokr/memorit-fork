<script setup lang="ts">
import { type Card, createCard } from "@/domain/card";
import { type CardSet, createCardSet } from "@/domain/card-set";
import { faker } from "@faker-js/faker";
import { nanoid } from "nanoid";
import flatten from "lodash/flatten";
import { deleteDB } from "idb";
import { getDBInstance } from "@/services/idb-storage";

const set1 = [
  ["в интернет(е)", "on the internet"],
  ["на публике", "in a public space"],
  ["humble (adj)", "скромный"],
  ["to brag", "хвастаться"],
  ["skinny dipping", "купаться голышом"],
  ["to get married", "жениться / выходить замуж"],
  ["grinder", "измельчитель"],
  ["intently", "внимательно, тщательно"],
  ["twice a month", "дважды в месяц"],
  ["make mistakes", "совершать ошибки"],
  ["in the Balkan sea", "на Балканах"],
  ["если бы ты покупал", "if you were to buy"],
  ["cog in the system", "Мелкая часть чего-то большого"],
  ["let’s crack on!", "let’s start!"],
  ["to put on weight", "to gain weight"],
  ["to convey", "передавать (мысль)"],
  ["to make an effort", "прилагать усилие"],
  ["talks to", "Разговаривать с"],
  ["to be keen on", "увлекаться"],
  ["to be eager", "быть нетерпеливым"],
  ["rug", "коврик"],
  ["doormat", "коврик в прихожей"],
  ["I *am* a **sandwich**", "Ok"],
];
const set2 = [
  ["to drive", "drove, driven"],
  ["to forget", "forgot, forgotten"],
  ["to brag", "bragged, bragged"],
  ["to ride", "rode, ridden"],
  ["to wake", "woke, woken"],
  ["to wear", "wore, worn"],
  ["to swear", "swore, sworn"],
  ["to tear", "tore, torn"],
  ["to fly", "flew, flown"],
  ["to draw", "drew, drawn"],
  ["to swim", "swam, swum"],
  ["to ring", "rang, rung"],
  ["to sing", "sang, sung"],
  ["to stink", "stank, stunk"],
  ["to run", "ran, run"],
];
const set3 = [
  ["Α α", "альфа"],
  ["Β β ϐ", "бета (вита)"],
  ["Γ γ", "гамма"],
  ["Δ δ", "дельта"],
  ["Ε ε ϵ", "эпсилон"],
  ["Ζ ζ", "дзета (зита)"],
  ["Η η", "эта (ита)"],
  ["Θ θ ϴ ϑ", "тета (фита)"],
  ["Ι ι", "йота"],
  ["Κ κ ϰ", "каппа"],
  ["Λ λ", "лямбда (лямда)"],
  ["Μ μ", "мю (ми)"],
  ["Ν ν", "ню (ни)"],
  ["Ξ ξ", "кси"],
  ["Ο ο", "омикрон"],
  ["Π π ϖ", "пи"],
  ["Ρ ρ ϱ", "ро"],
  ["Σ σ ς", "сигма"],
  ["Τ τ", "тау (тав)"],
  ["Υ ϒ υ", "ипсилон"],
  ["Φ φ ϕ", "фи"],
  ["Χ χ", "хи"],
  ["Ψ ψ", "пси"],
  ["Ω ω", "омега"],
] as const;

const cardSets = [
  createCardSet({
    id: nanoid(),
    title: "English",
    createdAt: faker.date.recent(30, "2022-12-31").toISOString(),
  }),
  createCardSet({
    id: nanoid(),
    title: "Conjunctions",
    createdAt: faker.date.recent(30, "2022-12-31").toISOString(),
  }),
  createCardSet({
    id: nanoid(),
    title: "Греческий алфавит",
    createdAt: faker.date.recent(30, "2022-12-31").toISOString(),
  }),
];

const cards = [
  ...set1.map(([q, a]) =>
    createCard({
      id: nanoid(),
      front: q,
      back: a,
      cardSetId: cardSets[0].id,
      createdAt: faker.date.recent(30).toISOString(),
    })
  ),
  ...set2.map(([q, a]) =>
    createCard({
      id: nanoid(),
      front: q,
      back: a,
      cardSetId: cardSets[1].id,
      createdAt: faker.date.recent(30).toISOString(),
    })
  ),
  ...set3.map(([q, a]) =>
    createCard({
      id: nanoid(),
      front: q,
      back: a,
      cardSetId: cardSets[2].id,
      createdAt: faker.date.recent(30).toISOString(),
    })
  ),
];

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

const onMySeed = async () => {
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

const addGreek = async () => {
  const db = await getDBInstance();

  console.time("greek create card-sets");
  const cardSetsTransaction = db.transaction("card-sets", "readwrite");
  await Promise.all([
    cardSetsTransaction.store.add(cardSets[2]),
    cardSetsTransaction.done,
  ]);
  console.timeEnd("greek create card-sets");

  console.time("create greek cards");
  const cardsTransaction = db.transaction("cards", "readwrite");
  const cardsPromises = set3
    .map(([q, a]) =>
      createCard({
        id: nanoid(),
        front: q,
        back: a,
        cardSetId: cardSets[2].id,
        createdAt: faker.date.recent(30).toISOString(),
      })
    )
    .map((card) => cardsTransaction.store.add(card));
  await Promise.all([...cardsPromises, cardsTransaction.done]);
  console.timeEnd("create greek cards");

  alert("Dummy data added");
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
    <p>Add Greek alphabet</p>
    <p>
      <button
        class="inline-flex gap-2 px-4 py-2 items-center bg-indigo-100 rounded-2xl justify-center"
        type="button"
        @click="addGreek"
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
    <button
      type="button"
      class="fixed right-4 bottom-4 p-2.5 flex rounded-2xl bg-green-50 shadow-md opacity-10"
      @click="onMySeed"
    >
      <span
        class="material-symbols-outlined text-xl leading-none text-green-50"
      >
        database
      </span>
    </button>
  </div>
</template>
