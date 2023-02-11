<script setup lang="ts">
const cards = [
  {
    id: "96eStZk-_nzVR5mvlxY5b",
    front: "Metrics orchestrate",
    back: "circuit Views",
    cardSetId: "Mvi41fpojy-yo0HCwTTc5",
    progress: 5,
    createdAt: "2023-01-17T01:11:35.932Z",
    showAfter: "2023-02-01T15:56:11.875Z",
  },
  {
    id: "AhjsFVmIy2G7k7-s6ElFS",
    front: "Grocery Northeast",
    back: "reciprocal with",
    cardSetId: "Mvi41fpojy-yo0HCwTTc5",
    progress: 9,
    createdAt: "2023-01-14T02:16:05.707Z",
    showAfter: "2023-02-12T06:18:59.356Z",
  },
  {
    id: "JA4Bn-6gkUB5F6CppGBYn",
    front: "vortals onto",
    back: "Oklahoma improvement",
    cardSetId: "Mvi41fpojy-yo0HCwTTc5",
    progress: 3,
    createdAt: "2023-01-23T14:49:39.320Z",
    showAfter: "2023-01-31T13:38:17.577Z",
  },
  {
    id: "1ij9TgPVNABnnvLnd9ihB",
    front: "Land Monitored",
    back: "Chair odio",
    cardSetId: "Mvi41fpojy-yo0HCwTTc5",
    progress: 9,
    createdAt: "2023-01-25T05:05:37.258Z",
    showAfter: "2023-02-09T04:45:33.362Z",
  },
  {
    id: "tc2HTWtTXk5yJM5sTT9PQ",
    front: "Bicycle Non",
    back: "UTF8 OCR",
    cardSetId: "Mvi41fpojy-yo0HCwTTc5",
    progress: 3,
    createdAt: "2023-01-23T19:19:38.754Z",
    showAfter: "2023-02-09T01:11:47.843Z",
  },
  {
    id: "a-ylmAiUu8bIbEuUDTCpR",
    front: "Touring Electric",
    back: "Bronze tesla",
    cardSetId: "Mvi41fpojy-yo0HCwTTc5",
    progress: 3,
    createdAt: "2023-01-29T06:05:04.521Z",
    showAfter: "2023-02-09T12:17:06.900Z",
  },
  {
    id: "70UjzsV6cTaSr7snwFAwH",
    front: "dissolve Circles",
    back: "Toyota internet",
    cardSetId: "Mvi41fpojy-yo0HCwTTc5",
    progress: 2,
    createdAt: "2023-02-01T03:44:40.930Z",
    showAfter: "2023-02-13T00:06:59.608Z",
  },
  {
    id: "LGGi1z1ZrVUKXksKQeBav",
    front: "bypass microchip",
    back: "capability Soft",
    cardSetId: "Mvi41fpojy-yo0HCwTTc5",
    progress: 7,
    createdAt: "2023-02-09T06:30:23.833Z",
    showAfter: "2023-02-08T15:18:03.973Z",
  },
  {
    id: "PJDiofo1tEmupjfom1NRB",
    front: "Electric candela",
    back: "web Tasty",
    cardSetId: "Mvi41fpojy-yo0HCwTTc5",
    progress: 7,
    createdAt: "2023-02-01T03:57:31.387Z",
    showAfter: "2023-02-09T07:38:40.488Z",
  },
  {
    id: "46odZ0W3Xgwx-HnMBV9zK",
    front: "at pariatur",
    back: "male Jazz",
    cardSetId: "Mvi41fpojy-yo0HCwTTc5",
    progress: 7,
    createdAt: "2023-01-31T18:49:32.765Z",
    showAfter: "2023-02-10T09:43:35.825Z",
  },
];
</script>

<template>
  <div class="">
    <ul>
      <li v-for="card in cards" :key="card.id" class="border-t p-4 flex gap-4">
        <span class="flex-1">{{ card.front }}</span>
        <span class="flex-1">{{ card.back }}</span>
      </li>
    </ul>
  </div>
</template>

<style scoped></style>
