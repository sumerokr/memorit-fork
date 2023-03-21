<script setup lang="ts">
import { getDBInstance } from "@/services/idb-storage";
import RouterLinkIconButton from "./components/RouterLinkIconButton.vue";
import { ref } from "vue";

const dbVersion = ref();

getDBInstance().then((db) => {
  dbVersion.value = db.version;
});
</script>

<template>
  <div class="flex flex-col flex-grow">
    <RouterView />
    <RouterLinkIconButton
      icon="database"
      class="fixed left-4 bottom-4 p-2.5 flex rounded-2xl bg-blue-100 shadow-md"
      :to="{ name: 'seed' }"
    ></RouterLinkIconButton>
    <div
      class="fixed bottom-0 left-1/2 -translate-x-1/2 py-1 px-2 rounded-t-md text-xs bg-white opacity-50"
    >
      ver: {{ 22030016 }}. DB ver: {{ dbVersion }}
    </div>
  </div>
</template>
