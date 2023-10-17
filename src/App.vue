<script setup lang="ts">
import { getDBInstance } from "@/services/idb-storage";
// import RouterLinkIconButton from "./components/RouterLinkIconButton.vue";
import { ref } from "vue";
import { useRoute } from "vue-router";

const dbVersion = ref();
const route = useRoute();

getDBInstance().then((db) => {
  dbVersion.value = db.version;
});

//@ts-ignore
window.moo = {
  foo3: "__CF_PAGES_BRANCH__",
};
</script>

<template>
  <div class="flex flex-col flex-grow">
    <RouterView />
    <!-- <RouterLinkIconButton
      v-if="route.name === 'sets'"
      icon="database"
      class="fixed left-4 bottom-4 p-2.5 flex rounded-2xl bg-blue-100 shadow-md"
      :to="{ name: 'seed' }"
    ></RouterLinkIconButton> -->
    <div
      v-if="route.name === 'sets'"
      class="fixed bottom-0 left-1/2 -translate-x-1/2 py-1 px-2 rounded-t-md text-xs bg-white opacity-50"
    >
      ver: 08101040. DB ver: {{ dbVersion }}, branch: __CF_PAGES_BRANCH__
    </div>
  </div>
</template>
