<script setup lang="ts">
import { ref } from "vue";

const front = ref("");
const back = ref("");

const onSubmit = () => {
  front.value = "";
  back.value = "";
  console.log("submitted");
};
</script>

<template>
  <form class="border p-4" @submit.prevent="onSubmit">
    <div class="flex gap-4">
      <p class="flex-1">
        <label class="text-sm opacity-50" for="front">Card front</label><br />
        <input
          v-model="front"
          id="front"
          class="leading-5 border-2 rounded-2xl p-2 w-full"
          type="text"
        />
      </p>
      <p class="flex-1">
        <label class="text-sm opacity-50" for="back">Card back</label><br />
        <input
          v-model="back"
          id="back"
          class="leading-5 border-2 rounded-2xl p-2 w-full"
          type="text"
        />
      </p>
    </div>
    <p class="mt-4 text-right">
      <button
        class="inline-flex justify-center gap-2 px-4 py-2 items-center text-white font-bold bg-blue-400 rounded-2xl"
        type="submit"
      >
        <span>Save</span>
        <span class="material-symbols-outlined text-xl leading-none">
          save
        </span>
      </button>
    </p>
  </form>
</template>

<style scoped></style>
