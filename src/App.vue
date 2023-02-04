<script setup lang="ts">
import { RouterView } from "vue-router";

const cleanLocaleStorage = () => {
  localStorage.clear();
};
</script>

<template>
  <div>
    <RouterLink :to="{ name: 'home' }">Home</RouterLink> |
    <button @click="cleanLocaleStorage">clean LS</button>
    <RouterView />
  </div>
</template>

<style scoped></style>
