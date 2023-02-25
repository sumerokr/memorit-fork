<script setup lang="ts">
import { ref } from "vue";
import type { Card } from "@/domain/card";
import { onClickOutside } from "@vueuse/core";
import { useDeleteCard } from "@/composables/use-cards";

type Props = {
  card: Card;
};

defineProps<Props>();

const { execute, deletingIds } = useDeleteCard();

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
      <div class="relative ml-4" ref="menuRef">
        <button
          class="flex -m-2 p-2 rounded-2xl"
          type="button"
          @click="isMenuOpen = !isMenuOpen"
        >
          <span class="material-symbols-outlined">more_vert</span>
        </button>
        <div v-if="isMenuOpen" class="absolute -top-2 mr-2 right-full flex">
          <button
            class="flex gap-2 px-4 py-2 mr-2 items-center bg-red-100 rounded-2xl justify-center"
            :disabled="deletingIds.includes(card.id)"
            @click="execute(card.id)"
          >
            Delete
            <span class="material-symbols-outlined text-xl leading-none">
              delete
            </span>
          </button>
          <RouterLink
            :to="{ name: 'card-edit', params: { id: card.id } }"
            class="flex gap-2 px-4 py-2 items-center bg-indigo-100 rounded-2xl justify-center"
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
