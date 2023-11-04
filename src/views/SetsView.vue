<script setup lang="ts">
import { useAsyncState } from "@vueuse/core";
import { getCardSetsUC } from "@/application/get-card-sets";
import CardSetList from "@/components/CardSetList.vue";
import RouterLinkCommonButton from "@/components/RouterLinkCommonButton.vue";

const { state: cardSets, error } = useAsyncState(getCardSetsUC, null);
</script>

<template>
  <div class="flex flex-col flex-grow bg-neutral-100 p-4 pb-24">
    <div class="flex items-center mb-4">
      <h1 class="text-2xl">Card sets</h1>
    </div>

    <p v-if="error" class="mb-4 border border-red-500 rounded-2xl p-4 bg-red-50">Error</p>

    <CardSetList v-if="cardSets?.length" :card-sets="cardSets" />

    <div class="my-auto text-center" v-else-if="cardSets && !cardSets.length">
      <p class="mb-4">You have no card sets yet.</p>
      <p>
        <RouterLinkCommonButton icon="add" :to="{ name: 'new-card-set' }" class="bg-indigo-200">
          Create
        </RouterLinkCommonButton>
      </p>
    </div>

    <RouterLink
      class="fixed right-4 bottom-4 p-4 flex rounded-2xl bg-indigo-500 text-white shadow-md"
      :to="{ name: 'new-card-set' }"
      ><span class="material-symbols-rounded text-2xl leading-none">add</span></RouterLink
    >
  </div>
</template>
