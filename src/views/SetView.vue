<script setup lang="ts">
import { useRoute } from "vue-router";
import { cardSetStorage } from "@/services/card-set-storage";
import { useGetCardSetById } from "@/composables/use-card-sets";

const route = useRoute();
const id = route.params.id as string;
let cardSet = cardSetStorage.getById(id);
const { execute: getCardSetById, isReady, isLoading } = useGetCardSetById();
if (!cardSet) {
  getCardSetById(id);
}
</script>

<template>
  <div>
    <div v-if="isReady && cardSet">{{ cardSet.title }}</div>
    <div v-else-if="isLoading">Loading...</div>
    <div v-else>Error?</div>
  </div>
</template>

<style scoped></style>
