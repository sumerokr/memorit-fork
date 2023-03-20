<script setup lang="ts">
import type { RouterLinkProps } from "vue-router";

// hacky export
export interface Props extends RouterLinkProps {
  icon: string;
}

defineProps<Props>();
</script>

<template>
  <RouterLink class="inline-flex p-3 rounded-[50%]" v-bind="$props">
    <span class="material-symbols-outlined leading-none">{{ icon }}</span>
  </RouterLink>
</template>
