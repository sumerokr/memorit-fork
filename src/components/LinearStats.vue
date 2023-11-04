<script setup lang="ts">
import type { ProgressMap } from "@/domain/stat";

type Props = {
  progressMap: ProgressMap;
};

defineProps<Props>();
</script>

<template>
  <div class="flex rounded h-2 overflow-hidden">
    <div class="p1" :style="`flex-grow: ${progressMap[1]}`"></div>
    <div class="p2" :style="`flex-grow: ${progressMap[2]}`"></div>
    <div class="p3" :style="`flex-grow: ${progressMap[3]}`"></div>
    <div class="p4" :style="`flex-grow: ${progressMap[4]}`"></div>
    <div class="p5" :style="`flex-grow: ${progressMap[5]}`"></div>
    <div class="p6" :style="`flex-grow: ${progressMap[6]}`"></div>
    <div class="p7" :style="`flex-grow: ${progressMap[7]}`"></div>
    <div class="p8" :style="`flex-grow: ${progressMap[8]}`"></div>
    <div class="p9" :style="`flex-grow: ${progressMap[9]}`"></div>
    <div class="p10" :style="`flex-grow: ${progressMap[10]}`"></div>
    <div class="bg-neutral-100" :style="`flex-grow: ${progressMap[-1]}`"></div>
    <div class="bg-neutral-200" :style="`flex-grow: ${progressMap[0]}`"></div>
  </div>
</template>

<style scoped>
.p1 {
  background-color: rgb(0, 128, 255);
}
.p2 {
  background-color: rgb(102, 178, 255);
}
.p3 {
  background-color: rgb(153, 204, 255);
}
.p4 {
  background-color: rgb(179, 217, 255);
}
.p5 {
  background-color: rgb(204, 230, 255);
}
.p6 {
  background-color: rgb(150, 220, 200);
}
.p7 {
  background-color: rgb(140, 215, 190);
}
.p8 {
  background-color: rgb(100, 200, 150);
}
.p9 {
  background-color: rgb(90, 190, 140);
}
.p10 {
  background-color: rgb(50, 150, 100);
}
</style>
