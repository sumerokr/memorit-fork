<script setup lang="ts">
import { getDBInstance } from "@/services/idb-storage";
import RouterLinkIconButton from "./components/RouterLinkIconButton.vue";
import PwaToast from "./components/PwaToast.vue";
import { ref } from "vue";
import { useRoute } from "vue-router";

const dbVersion = ref();
const route = useRoute();

getDBInstance().then((db) => {
  dbVersion.value = db.version;
});

const sha = __CF_PAGES_COMMIT_SHA__?.slice(0, 7) ?? "n/a";
const branch = __CF_PAGES_BRANCH__ ?? "n/a";
const date = __BUILD_DATE__?.slice(0, 10).replace(/-/g, "");
</script>

<template>
  <div class="flex flex-col flex-grow">
    <RouterView />
    <RouterLinkIconButton
      v-if="route.name === 'sets'"
      icon="database"
      class="fixed left-4 bottom-4 p-2.5 flex rounded-2xl bg-blue-100 shadow-md"
      :to="{ name: 'seed' }"
    ></RouterLinkIconButton>
    <div
      v-if="route.name === 'sets'"
      class="fixed bottom-0 left-1/2 -translate-x-1/2 w-max grid grid-cols-2 gap-x-4 py-1 px-2 rounded-t-md text-xs bg-white opacity-50"
    >
      <span>db: {{ dbVersion }}</span>
      <span>branch: {{ branch }}</span>
      <span>date: {{ date }}</span>
      <span>sha: {{ sha }}</span>
    </div>

    <PwaToast />
  </div>
</template>
