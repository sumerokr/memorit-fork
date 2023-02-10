<script setup lang="ts"></script>

<template>
  <div class="border-b p-4 bg-indigo-100">
    <p class="mb-4">
      <RouterLink :to="{ name: 'sets' }" class="text-blue-500"
        ><span class="inline-block rotate-180">➜</span> Back to card
        sets</RouterLink
      >
    </p>

    <div>
      <h1 class="text-4xl mb-10">English adjectives</h1>
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

  <div class="flex gap-4 p-4 border-b">
    <button
      class="flex-auto px-4 py-2 bg-blue-400 rounded-2xl flex justify-center"
      type="button"
    >
      <span>Study</span>
      <span class="material-symbols-outlined">play_arrow</span>
    </button>
    <button
      class="flex-auto px-4 py-2 bg-blue-200 rounded-2xl flex justify-center"
      type="button"
    >
      Add <span class="material-symbols-outlined">add</span>
    </button>
  </div>

  <ul>
    <li v-for="n in 10" :key="n" class="border-b p-4 flex gap-4">
      <span class="flex-1">Front word</span>
      <span class="flex-1">Back word</span>
    </li>
  </ul>
</template>

<style scoped></style>
