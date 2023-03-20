<script setup lang="ts">
type Props = {
  icon: string;
  type?: "button" | "submit";
};

withDefaults(defineProps<Props>(), {
  type: "button",
});
</script>

<template>
  <button class="inline-flex p-3 rounded-[50%]" :type="type">
    <span class="material-symbols-outlined leading-none">{{ icon }}</span>
  </button>
</template>
