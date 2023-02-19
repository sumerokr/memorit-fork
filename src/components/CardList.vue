<script setup lang="ts">
import type { Card } from "@/domain/card";

type Props = {
  cards: Card[];
};

defineProps<Props>();
</script>

<template>
  <ul class="flex flex-col gap-2">
    <li
      v-for="card in cards"
      :key="card.id"
      class="grid border rounded-xl p-4 bg-white"
    >
      <span class="flex-1">{{ card.front }}</span>
      <hr class="my-2" />
      <span class="flex-1 opacity-60">{{ card.back }}</span>
    </li>
  </ul>
</template>
