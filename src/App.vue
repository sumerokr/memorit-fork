<template>
  <div class="flex flex-col flex-grow">
    <RouterView />
    <RouterLink
      class="fixed left-4 bottom-4 p-2.5 flex rounded-2xl bg-green-50 shadow-md"
      :to="{ name: 'seed' }"
      ><span class="material-symbols-outlined text-xl leading-none">
        database
      </span></RouterLink
    >
    <div>Version: {{ process.env.CF_PAGES_COMMIT_SHA }}</div>
  </div>
</template>
