<script setup lang="ts">
import type { ProgressMap } from "@/domain/stat";

type Props = {
  progressMap: ProgressMap;
};

defineProps<Props>();
</script>

<template>
  <div class="flex rounded h-2 overflow-hidden">
    <div class="bg-neutral-100" :style="`flex-grow: ${progressMap[-1]}`"></div>
    <div class="bg-neutral-200" :style="`flex-grow: ${progressMap[0]}`"></div>
    <div class="bg-rose-200" :style="`flex-grow: ${progressMap[1]}`"></div>
    <div class="bg-red-200" :style="`flex-grow: ${progressMap[2]}`"></div>
    <div class="bg-orange-200" :style="`flex-grow: ${progressMap[3]}`"></div>
    <div class="bg-amber-200" :style="`flex-grow: ${progressMap[4]}`"></div>
    <div class="bg-yellow-200" :style="`flex-grow: ${progressMap[5]}`"></div>
    <div class="bg-lime-200" :style="`flex-grow: ${progressMap[6]}`"></div>
    <div class="bg-green-200" :style="`flex-grow: ${progressMap[7]}`"></div>
    <div class="bg-emerald-200" :style="`flex-grow: ${progressMap[8]}`"></div>
    <div class="bg-teal-200" :style="`flex-grow: ${progressMap[9]}`"></div>
    <div class="bg-cyan-200" :style="`flex-grow: ${progressMap[10]}`"></div>
  </div>
</template>
