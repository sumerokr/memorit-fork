<script setup lang="ts">
import type { Card } from "@/domain/card";
import CardListItem from "./CardListItem.vue";

type Props = {
  cards: Card[];
};

defineProps<Props>();

defineEmits(["delete"]);
</script>

<template>
  <ul class="flex flex-col gap-2">
    <CardListItem v-for="card in cards" :card="card" :key="card.id" />
  </ul>
</template>
