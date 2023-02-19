<script setup lang="ts">
import { cardSets } from "@/services/card-sets-storage";
import CardSetList from "@/components/CardSetList.vue";
import { useGetCardSets } from "@/composables/use-card-sets";

const { execute, isLoading, isReady } = useGetCardSets();
execute();
</script>

<template>
  <div class="flex-grow bg-neutral-100 p-4">
    <h1 class="text-2xl mb-4">Card sets</h1>
    <template v-if="isReady">
      <CardSetList v-if="cardSets.length" :card-sets="cardSets" />
      <p v-else>
        You have no card sets yet.
        <RouterLink
          :to="{ name: 'new-card-set' }"
          class="gap-2 px-4 py-2 items-center bg-indigo-200 rounded-2xl inline-flex justify-center"
        >
          Create
          <span class="material-symbols-outlined text-xl leading-none">
            add
          </span>
        </RouterLink>
      </p>
    </template>
    <p v-else-if="isLoading">Loading...</p>
    <RouterLink
      class="fixed right-4 bottom-4 p-4 flex rounded-2xl bg-indigo-200 shadow-md"
      :to="{ name: 'new-card-set' }"
      ><span class="material-symbols-outlined text-2xl leading-none">
        add
      </span></RouterLink
    >
  </div>
</template>
