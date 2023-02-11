<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const resolvedLink = computed(() => {
  return (() => {
    if (route.name === "set2") {
      return {
        text: "View",
        link: {
          name: "cards",
          params: {
            id: route.params.id,
          },
        },
      };
    } else if (route.name === "cards") {
      return {
        text: "Hide",
        link: {
          name: "set2",
          params: {
            id: route.params.id,
          },
        },
      };
    }
  })();
});
</script>

<template>
  <div class="bg-neutral-100 flex-grow flex flex-col">
    <div class="p-4">
      <p class="mb-12">
        <RouterLink :to="{ name: 'sets' }" class="text-blue-500"
          ><span class="inline-block rotate-180">➜</span> Back to card
          sets</RouterLink
        >
      </p>

      <div>
        <h1 class="text-4xl mb-12">English adjectives</h1>
        <div class="flex gap-x-4">
          <dl class="basis-1/3">
            <dt class="text-xs opacity-50">Cards studied</dt>
            <dd class="mb-2">12/20</dd>

            <dt class="text-xs opacity-50">Progress</dt>
            <dd>23%</dd>
          </dl>
          <div class="basis-2/3 flex flex-col">
            <p class="mb-1.5 text-xs opacity-50">Progress</p>
            <div class="flex items-end gap-x-1 flex-1">
              <div class="flex-1 bg-red-400 h-full"></div>
              <div class="flex-1 bg-orange-400 h-5/6"></div>
              <div class="flex-1 bg-orange-400 h-4/6"></div>
              <div class="flex-1 bg-amber-400 h-1/6"></div>
              <div class="flex-1 bg-amber-400 h-2/6"></div>
              <div class="flex-1 bg-yellow-400 h-4/6"></div>
              <div class="flex-1 bg-yellow-400 h-3/6"></div>
              <div class="flex-1 bg-lime-400 h-1/6"></div>
              <div class="flex-1 bg-lime-400 h-2/6"></div>
              <div class="flex-1 bg-green-400 h-1/6"></div>
              <div class="flex-1 bg-green-400 h-1/6"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="flex-grow border-t rounded-2xl bg-white">
      <div class="flex flex-wrap gap-4 p-4">
        <RouterLink
          :to="resolvedLink!.link"
          class="flex-auto gap-2 px-4 py-2 bg-blue-200 rounded-2xl flex justify-center"
        >
          {{ resolvedLink!.text }}
          <span class="material-symbols-outlined"> view_agenda </span>
        </RouterLink>

        <button
          class="flex-auto gap-2 px-4 py-2 bg-blue-200 rounded-2xl flex justify-center"
          type="button"
        >
          Add <span class="material-symbols-outlined">add</span>
        </button>
        <button
          class="flex-auto gap-2 px-4 py-2 text-white font-bold bg-blue-400 rounded-2xl flex justify-center"
          type="button"
        >
          <span>Study</span>
          <span class="material-symbols-outlined">play_arrow</span>
        </button>
      </div>
      <RouterView />
    </div>
  </div>

  <!-- <ul>
    <li v-for="n in 10" :key="n" class="border-b p-4 flex gap-4">
      <span class="flex-1">Front word</span>
      <span class="flex-1">Back word</span>
    </li>
  </ul> -->
</template>

<style scoped></style>
