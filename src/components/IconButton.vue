<script setup lang="ts">
type Props = {
  icon: string;
  type?: "button" | "submit";
  color?: string;
};

const props = withDefaults(defineProps<Props>(), {
  type: "button",
});

const classes = [props.color ?? ""];
</script>

<template>
  <button class="inline-flex p-3 rounded-[50%]" :class="classes" :type="type">
    <span class="material-symbols-outlined leading-none">{{ icon }}</span>
  </button>
</template>
