<script setup lang="ts">
import { onUnmounted, onMounted, ref } from "vue";

const length = ref(0);

// how long to wait for the first appearance
let initialTimeout = 300;
let currentTimeout = initialTimeout;
let timeoutId: ReturnType<typeof setTimeout>;

const callback = () => {
  length.value += 1;
  currentTimeout += 100;
  timeoutId = setTimeout(callback, currentTimeout);
};

onMounted(() => {
  timeoutId = setTimeout(callback, currentTimeout);
});

onUnmounted(() => {
  clearInterval(timeoutId);
});
</script>

<template>
  <TransitionGroup name="fade" tag="ul" class="grid gap-2">
    <li v-for="n of length" :key="n">
      <div class="block border rounded-xl p-4 bg-white">
        <h2 class="text-xl mb-2"><div class="rounded w-48 bg-neutral-100">&nbsp;</div></h2>
        <p class="flex items-baseline justify-between opacity-60">
          <span class="rounded w-16 bg-neutral-100">&nbsp;</span>
          <span class="rounded w-16 bg-neutral-100">&nbsp;</span>
        </p>
      </div>
    </li>
  </TransitionGroup>
</template>

<style scoped>
.fade-enter-active {
  transition-property: transform, opacity;
  transition-duration: 0.3s;
  transition-timing-function: ease-out;
}

.fade-enter-from {
  opacity: 0;
  transform: translateY(1rem);
}
</style>
