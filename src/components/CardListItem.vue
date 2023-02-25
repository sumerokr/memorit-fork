<script setup lang="ts">
import type { Card } from "@/domain/card";
import { ref } from "vue";
import { onClickOutside } from "@vueuse/core";

type Props = {
  card: Card;
};

defineProps<Props>();

const isMenuOpen = ref(false);
const menuRef = ref(null);

onClickOutside(menuRef, () => {
  isMenuOpen.value = false;
});
</script>

<template>
  <li class="border rounded-xl p-4 bg-white">
    <div class="flex items-start justify-between">
      <span class="">{{ card.front }}</span>
      <div class="relative ml-4 leading-none" ref="menuRef">
        <button
          class="-m-2 p-2 rounded-2xl leading-none"
          type="button"
          @click="isMenuOpen = !isMenuOpen"
        >
          <span class="material-symbols-outlined align-top">more_vert</span>
        </button>
        <div v-if="isMenuOpen" class="absolute top-8 mt-1 -right-2 w-max">
          <RouterLink
            :to="{ name: 'card-edit', params: { id: card.id } }"
            class="flex-grow gap-2 px-4 py-2 items-center bg-indigo-50 rounded-2xl flex justify-center"
          >
            Edit
            <span class="material-symbols-outlined text-xl leading-none">
              edit
            </span>
          </RouterLink>
        </div>
      </div>
    </div>
    <hr class="my-2" />
    <span class="opacity-60">{{ card.back }}</span>
  </li>
</template>
