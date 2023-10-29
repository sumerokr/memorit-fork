<script setup lang="ts">
import type { RouterLinkProps } from "vue-router";

// hacky export
export interface Props extends RouterLinkProps {
  icon: string;
}

defineProps<Props>();
</script>

<template>
  <RouterLink v-bind="$props" class="inline-flex items-center justify-center p-3 rounded-3xl">
    <span class="material-symbols-rounded leading-none"
      >{{ icon }}<span class="sr-only"><slot /></span
    ></span>
  </RouterLink>
</template>
