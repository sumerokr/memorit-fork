<script setup lang="ts">
import { ref } from "vue";
import type { Card } from "@/domain/card";
import { onClickOutside } from "@vueuse/core";
import IconButton from "@/components/IconButton.vue";
import CommonButton from "@/components/CommonButton.vue";
import RouterLinkCommonButton from "@/components/RouterLinkCommonButton.vue";

type Props = {
  card: Card;
};

defineProps<Props>();

defineEmits<{
  delete: [id: Card["id"]];
}>();

const isMenuOpen = ref(false);
const menuRef = ref(null);

onClickOutside(menuRef, () => {
  isMenuOpen.value = false;
});
</script>

<template>
  <li class="border rounded-xl p-4 bg-white">
    <div class="flex gap-4 items-start justify-between">
      <span class="">{{ card.front }}</span>
      <div class="relative leading-none" ref="menuRef">
        <IconButton
          icon="more_vert"
          class="flex -m-3 p-2 rounded-2xl"
          @click="isMenuOpen = !isMenuOpen"
        />
        <div v-if="isMenuOpen" class="flex gap-2 absolute -top-3 mr-5 right-full">
          <CommonButton before="delete" class="bg-red-200" @click="$emit('delete', card.id)">
            Delete</CommonButton
          >
          <RouterLinkCommonButton
            before="edit"
            :to="{ name: 'card-edit', params: { id: card.id } }"
            class="bg-indigo-200"
          >
            Edit</RouterLinkCommonButton
          >
          <RouterLinkCommonButton
            :to="{ name: 'card', params: { id: card.id } }"
            class="bg-red-200"
          >
            View</RouterLinkCommonButton
          >
        </div>
      </div>
    </div>
    <hr class="my-2" />
    <span class="opacity-60">{{ card.back }}</span>
  </li>
</template>
