<script setup lang="ts">
import { reactive } from "vue";
import { type Card, createCard } from "@/domain/card";
import { type CardSetV2, createCardSet } from "@/domain/card-set";
import { nanoid } from "nanoid";
import flatten from "lodash/flatten";
import { deleteDB } from "idb";
import { getDBInstance } from "@/services/idb-storage";
import IconButton from "@/components/IconButton.vue";

const _faker = () => import("@faker-js/faker");

const createSetWithCards = (
  cardSetTitle: CardSetV2["title"],
  cardsRaw: [front: Card["front"], back: Card["back"]][]
) => {
  const cardSet = createCardSet({
    id: nanoid(),
    title: cardSetTitle,
    createdAt: new Date().toISOString(),
  });

  const cards = cardsRaw.map(([front, back]) =>
    createCard({
      id: nanoid(),
      front,
      back,
      cardSetId: cardSet.id,
      createdAt: new Date().toISOString(),
      createdBy: "",
    })
  );

  return [cardSet, cards] as const;
};

//#region ready sets
const setMap = new Map<CardSetV2["id"], [string, [string, string][]]>();
setMap.set(nanoid(), [
  "Немецкий B1 v1",
  [
    ["spannend", "увлекательный"],
    ["beeindrucken", "впечатлять"],
    ["sich Traum erfullen", "исполнить мечту"],
    ["notig notwendig", "необходимый"],
    ["Zusammenhang, .. e", "зависимость"],
    ["je nachdem", "в зависимости от"],
    ["schrit zur schrit", "шаг за шагом"],
    ["die Prufung -en (bestehen)", "экзамен (сдать)"],
    ["scheinen schien geschienen", "светить, казаться"],
    ["trozdem", "тем не менее"],
    ["aufgeben, gab auf, aufgegeben", "сдаваться"],
    ["plotzlich", "вдруг, внезапно, неожиданно"],
    ["unerreichbar", "недостижимый"],
    ["erfolgreich", "успешный"],
    ["die Ernuchterung", "разочарование"],
    ["der Auftritt", "выступление"],
    ["Lebensunterhalt", "средства к существованию"],
    ["versuchen", "пробовать, пытаться"],
    ["verwirklichen", "осуществлять"],
    ["gelten", "считаться, быть действительным"],
    ["verbringen, verbringt, verbrachte, hat verbracht", "проводить время"],
    ["die Unterstutzung", "поддержка"],
    ["verlieren, verliert, verlor, hat verloren", "терять"],
    ["kennen/lernen (+A)", "знакомиться"],
    ["schaffen, schafft, schuf, hat geschaffen", "успевать, создавать"],
    ["Aufsetz ..e", "эссе"],
    ["die Fertigkeit, -en", "навык"],
    ["angeboren", "врожденный"],
    ["entwickeln", "развивать"],
    ["die Beziehung, -en = Verhaltnis", "отношение"],
    ["die Erfahrung, -en", "опыт"],
    ["abfiltern", "отфильтровывать"],
    ["Absatz", "каблук"],
    ["ernst", "серьезный"],
    ["vertrosten", "утешать"],
    ["umarmen", "обнимать"],
    ["trostend", "утешительный"],
    ["verschwenden, vergeuden", "тратить непроизводительно"],
    ["das Netzwerk", "социальная сеть"],
    ["zuverlassig", "надежный"],
    ["hoflich", "вежливый"],
    ["grosszügig", "щедрый"],
    ["verantwortlich", "ответственный"],
    ["aufgeschlossen", "общительный"],
    ["geizig", "скупой, жадный"],
    ["gescwatzig", "болтливый"],
    ["nedselig", "общительный"],
    ["geheimhalten", "держать в тайне"],
    ["um Hilfe bitten", "просить о помощи"],
    ["im Stein sein", "быть в беде"],
    ["eindeutig", "однозначно"],
    ["sich verlassen auf", "полагаться на"],
    ["fassen", "подытоживать"],
    ["ohne zu uberlegen", "не раздумывая"],
    ["lassen ließ gelassen", "оставлять"],
    ["abwechslungsreich", "разнообразный"],
    ["abwechseln mit", "разнообразить"],
    ["einsetzen", "участвовать"],
    ["Held", "герой"],
    ["die Heldentat (en)", "подвиг"],
    ["der Umstand, .. e", "обстоятельство"],
    ["putzen", "чистить"],
    ["der Laptop, s", "ноутбук"],
    ["an dem Laptop arbeiten", "работать на ноутбуке"],
  ],
]);
setMap.set(nanoid(), [
  "Немецкий B1 v2",
  [
    ["wegen", "из-за, потому что"],
    ["Sauberkeit", "чистота"],
    ["das Verhalten", "поведение"],
    ["das Fahrzeug", "транспортное средство"],
    ["der Abfälle", "отходы"],
    ["nehmen", "брать"],
    ["die Rücksicht", "внимание, уважение"],
    ["der Aufenthalt", "пребывание, нахождение"],
    ["beachten", "принимать во внимание"],
    ["die Regel", "правило"],
    ["vermeiden", "избегать"],
    ["der Lärm", "шум"],
    ["stellen", "ставить"],
    ["gestattet", "разрешенный"],
    ["gestört", "нарушенный"],
    ["sowohl ... als auch", "как ... так и..."],
    ["streng", "строгий, суровый"],
    ["verboten", "запрещенный"],
    ["weder ... noch", "ни ... ни"],
    ["füttern", "кормить"],
    ["erlaubt", "разрешенный"],
    ["aufgeräumt", "прибранный"],
    ["betreten", "входить, заходить"],
    ["gehören", "принадлежать, относиться"],
    ["zwar ... aber", "хотя ... но"],
    ["die Mülltrennung", "сортировка мусора"],
    ["die Leine", "поводок"],
    ["fühlen", "чувствовать, ощущать"],
    ["führen", "вести, водить"],
    ["Aus Gründen", "по причинам"],
    ["im Schritttempo", "в темпе ходьбы"],
    ["das Boot", "лодка, шлюпка"],
    ["Kraftfahrzeug", "автомобиль"],
    ["bewegen", "двигать, передвигать"],
    ["ganz", "весь, целый"],
    ["das Gate", "выход на посадку"],
    ["das Gepäck", "багаж, кладь"],
    ["abholen", "забирать"],
    ["durch", "через, сквозь"],
    ["die Sicherheit", "безопасность, уверенность"],
    ["Zollkontrolle", "таможенный контроль"],
    ["einchecken", "регистрироваться на рейс"],
    ["die Ankunft", "прибытие, приезд"],
    ["der Abflug", "вылет, отправление"],
    ["absagen", "отменять"],
    ["umgehend", "немедленно, срочно"],
    ["wäre", "был бы"],
    ["inbegriffen", "включая, включительно"],
    ["verschiedene", "различные, разные"],
    ["vorbeibringen", "занести по дороге"],
    ["drohten", "угрожать"],
    ["lieblos", "бессердечный, черствый"],
    ["die Rutsche", "горка (детская)"],
    ["echt", "настоящий, подлинный, действительно"],
    ["das Hochhaus", "многоэтажный дом"],
    ["der Busch", "куст"],
    ["der Blumentopf", "цветочный горшок"],
    ["der Geruch", "запах"],
    ["die Regenrinne", "водосточная труба"],
    ["trennen", "отделять, расставаться"],
    ["Erlaubnis", "разрешение, позволение"],
    ["beherbergen", "приютить"],
    ["kleben", "клеить"],
    ["festkleben", "приклеивать"],
    ["sowie", "равно как и..., а также"],
    ["wütend, ärgerlich, sauer", "яростный, свирепый"],
    ["hübsch", "красивый, симпатичный, милый"],
    ["neugierig", "любопытный"],
    ["treu", "верный"],
    ["klug, intelligent", "умный"],
    ["dumm, blöd", "глупый"],
    ["schmutzig", "грязный"],
    ["wirklich", "действительно, в самом деле"],
    ["Ziemlich", "довольно, достаточно"],
    ["gar nicht", "совсем не, вовсе не"],
    ["nicht besonders", "не особенно"],
    ["überhaupt", "в общем, вообще"],
    ["beobachten", "наблюдать, следить"],
    ["ähnlich", "похожий, подобный"],
    ["überall", "везде, повсюду"],
    ["abgeben", "отдавать, сдавать"],
    ["bei", "у, при, в"],
    ["netten", "хороший"],
    ["stören", "беспокоить, мешать"],
    ["behalten", "оставлять, сохранять"],
    ["möglich", "возможно"],
    ["besichtigen", "Посещать (место)"],
    ["völlig", "полностью"],
    ["dagegen", "против этого"],
    ["fressen", "есть (о животных)"],
  ],
]);
setMap.set(nanoid(), [
  "Греческий алфавит",
  [
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
  ],
]);

const iterative = [...setMap.entries()].map(
  ([id, [title, cards]]) => [id, title, cards.length] as const
);
const addedIds = reactive(new Set<CardSetV2["id"]>());
const add = async (id: CardSetV2["id"]) => {
  const match = setMap.get(id);
  if (!match) {
    alert("set not found");
    return;
  }

  const [cardSet, cards] = createSetWithCards(...match);

  const db = await getDBInstance();
  const tx = db.transaction(["card-sets", "cards"], "readwrite");
  const promise = tx.objectStore("card-sets").add(cardSet);
  const promises = cards.map((card) => tx.objectStore("cards").add(card));
  await Promise.all([...promises, promise, tx.done]);

  addedIds.add(id);
  setTimeout(() => {
    addedIds.delete(id);
  }, 3000);
};

const onSeed = async (options: number[][]) => {
  const [[cardSetMin, cardSetMax], [cardsMin, cardsMax]] = options;
  const { faker } = await _faker();

  const cardSets = new Array(
    faker.datatype.number({
      min: cardSetMin,
      max: cardSetMax,
    })
  )
    .fill(null)
    .map<CardSetV2>(() =>
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

    <h2 class="text-xl font-medium">Dummy data</h2>
    <ul class="divide-y">
      <li class="flex items-start justify-between gap-4 py-4">
        <span class="py-2">Add 5-10 sets, 5-50 cards each</span>
        <IconButton
          icon="add"
          class="-my-1 bg-green-100 shadow-md"
          @click="
            onSeed([
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
            onSeed([
              [50, 100],
              [50, 500],
            ])
          "
        />
      </li>
    </ul>

    <h2 class="mt-6 text-xl font-medium">Ready sets</h2>
    <ul v-if="iterative.length" class="divide-y">
      <li
        v-for="[id, title, length] in iterative"
        :key="id"
        class="flex items-start justify-between gap-4 py-4"
      >
        <span class="py-2"
          >{{ title }}
          <span class="text-xs opacity-60">({{ length }} cards)</span></span
        >
        <IconButton
          :icon="addedIds.has(id) ? 'done' : 'add'"
          class="-my-1 shadow-md bg-green-100 disabled:opacity-40"
          :disabled="addedIds.has(id)"
          @click="add(id)"
        />
      </li>
    </ul>
    <hr class="border-t my-4" />

    <ul v-if="iterative.length" class="divide-y">
      <li class="flex items-start justify-between gap-4 py-4">
        <span class="py-2">Delete ALL data</span>
        <IconButton
          icon="delete"
          class="-my-1 bg-red-100 shadow-md"
          @click="onDelete"
        />
      </li>
    </ul>
  </div>
</template>
