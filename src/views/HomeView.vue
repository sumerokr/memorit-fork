<script setup lang="ts"></script>

<template>
  <div class="flex-grow bg-neutral-100 p-4">
    <h1 class="text-2xl mb-4">Welcome</h1>
    <p>
      Go to
      <RouterLink :to="{ name: 'sets' }" class="text-indigo-500"
        >Sets</RouterLink
      >
    </p>
  </div>
</template>
