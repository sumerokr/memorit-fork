<script setup lang="ts">
type Props = {
  before?: string;
  after?: string;
};

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
  <button
    class="inline-flex py-3 items-center rounded-3xl justify-center disabled:opacity-40"
    :class="resolvedClasses"
  >
    <span v-if="before" class="material-symbols-rounded leading-none">
      {{ before }}
    </span>
    <span class="font-medium">
      <slot />
    </span>
    <span v-if="after" class="material-symbols-rounded leading-none">
      {{ after }}
    </span>
  </button>
</template>
