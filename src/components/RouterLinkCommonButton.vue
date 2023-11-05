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
    class="inline-flex py-2 items-center rounded-full justify-center disabled:opacity-40"
    :class="resolvedClasses"
  >
    <span v-if="before" class="material-symbols-rounded text-xl leading-none">
      {{ before }}
    </span>
    <span class="font-medium">
      <slot />
    </span>
    <span v-if="after" class="material-symbols-rounded text-xl leading-none">
      {{ after }}
    </span>
  </RouterLink>
</template>
