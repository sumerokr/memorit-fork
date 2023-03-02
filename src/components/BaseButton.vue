<script setup lang="ts">
type Props = {
  before?: string;
  after?: string;
  color?: string;
  saturation?: string;
};

const props = withDefaults(defineProps<Props>(), {
  color: "indigo",
  saturation: "100",
});

const baseClass = {
  [`bg-${props.color}-${props.saturation}`]: true,
};

const neitherClass = {
  "px-6": true,
};

const beforeClass = {
  "gap-2": true,
  "pr-6": true,
  "pl-4": true,
};

const afterClass = {
  "gap-2": true,
  "pr-4": true,
  "pl-6": true,
};

const eitherClass = {
  "gap-2": true,
  "pr-4": true,
  "pl-4": true,
};

const resolvedClass = (() => {
  const resolved = { ...baseClass };
  if (!props.before && !props.after) {
    Object.assign(resolved, neitherClass);
  } else if (props.before && !props.after) {
    Object.assign(resolved, beforeClass);
  } else if (!props.before && props.after) {
    Object.assign(resolved, afterClass);
  } else if (props.before && props.after) {
    Object.assign(resolved, eitherClass);
  }
  return resolved;
})();
</script>

<template>
  <button
    class="inline-flex py-2 items-center rounded-2xl justify-center min-h-[40px] disabled:opacity-40"
    :class="resolvedClass"
  >
    <span v-if="before" class="material-symbols-outlined text-xl leading-none">
      {{ before }}
    </span>
    <slot />
    <span v-if="after" class="material-symbols-outlined text-xl leading-none">
      {{ after }}
    </span>
  </button>
</template>
