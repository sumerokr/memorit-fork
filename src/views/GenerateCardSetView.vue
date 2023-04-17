<script setup lang="ts">
import { ref } from "vue";
import RouterLinkIconButton from "@/components/RouterLinkIconButton.vue";
import CommonButton from "@/components/CommonButton.vue";

const onSubmit = async () => {
  // emit("submit");
};
</script>

<template>
  <div class="flex flex-col flex-grow p-4 bg-neutral-100">
    <div class="flex items-center mb-4">
      <RouterLinkIconButton
        icon="arrow_back"
        class="-ml-3 mr-1"
        :to="{ name: 'sets' }"
        >Back</RouterLinkIconButton
      >
      <h1 class="text-2xl">Generate new card set</h1>
    </div>

    <form @submit.prevent="onSubmit">
      <p class="mb-4">
        <label for="subject">Subject</label>
        <input
          id="subject"
          class="leading-5 border-2 rounded-2xl p-2 w-full"
          type="text"
          placeholder="Subject"
          autocomplete="off"
        />
      </p>
      <p class="mb-4">
        <input
          id="back"
          class="leading-5 border-2 rounded-2xl p-2 w-full"
          type="text"
          placeholder="Card back"
          autocomplete="off"
        />
      </p>
      <p class="text-right">
        <CommonButton
          before="save"
          class="bg-indigo-500 text-white"
          type="submit"
          >Save</CommonButton
        >
      </p>
    </form>
  </div>
</template>
