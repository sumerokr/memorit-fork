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
  <button
    class="inline-flex items-center justify-center p-3 rounded-3xl"
    :type="type"
  >
    <span class="material-symbols-outlined leading-none">{{ icon }}</span>
  </button>
</template>
