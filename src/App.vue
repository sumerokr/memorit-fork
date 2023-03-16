<script setup lang="ts">
import { getDBInstance } from "@/services/idb-storage";
import { ref } from "vue";

const dbVersion = ref();

getDBInstance().then((db) => {
  dbVersion.value = db.version;
});
</script>

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
    <div
      class="fixed bottom-0 left-1/2 -translate-x-1/2 py-1 px-2 rounded-t-md text-xs bg-white opacity-50"
    >
      ver: {{ 16032311 }}. DB ver: {{ dbVersion }}
    </div>
  </div>
</template>
