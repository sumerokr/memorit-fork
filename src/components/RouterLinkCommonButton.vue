<script setup lang="ts">
import type { RouterLinkProps } from "vue-router";

// hacky export
export interface Props extends RouterLinkProps {
  before?: string;
  after?: string;
}

const props = defineProps<Props>();

const resolvedClasses = (() => {
  if (!props.before && !props.after) {
    return ["px-6"];
  } else if (props.before && !props.after) {
    return ["gap-2", "pr-6", "pl-4"];
  } else if (!props.before && props.after) {
    return ["gap-2", "pr-4", "pl-6"];
  } else if (props.before && props.after) {
    return ["gap-2", "pr-4", "pl-4"];
  }
})();
</script>

<template>
  <RouterLink
    v-bind="$props"
    class="inline-flex py-3 items-center rounded-2xl justify-center disabled:opacity-40"
    :class="resolvedClasses"
  >
    <span v-if="before" class="material-symbols-outlined leading-none">
      {{ before }}
    </span>
    <slot />
    <span v-if="after" class="material-symbols-outlined leading-none">
      {{ after }}
    </span>
  </RouterLink>
</template>
