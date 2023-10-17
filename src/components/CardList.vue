<script setup lang="ts">
import type { Card } from "@/domain/card";
import CardListItem from "./CardListItem.vue";

type Props = {
  cards: Card[];
};

defineProps<Props>();

defineEmits<{
  delete: [id: Card["id"]];
}>();
</script>

<template>
  <ul class="flex flex-col gap-2">
    <CardListItem
      v-for="card in cards"
      :card="card"
      :key="card.id"
      @delete="(id) => $emit('delete', id)"
    />
  </ul>
</template>
