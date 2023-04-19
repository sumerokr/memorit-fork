<script setup lang="ts">
import RouterLinkIconButton from "@/components/RouterLinkIconButton.vue";
import CommonButton from "@/components/CommonButton.vue";

const onSubmit = async () => {
  fetch("http://localhost:8788/api/helloworld");
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
          placeholder="Card set name"
          autocomplete="off"
        />
      </p>
      <p class="flex gap-4 mb-4">
        <input
          id="back"
          class="basis-3/4 leading-5 border-2 rounded-2xl p-2 w-full"
          type="text"
          placeholder="Subject"
          autocomplete="off"
        />
        <input
          id="back"
          class="basis-1/4 leading-5 border-2 rounded-2xl p-2 w-full"
          type="text"
          placeholder="Count"
          autocomplete="off"
        />
      </p>
      <fieldset>
        <legend>Front</legend>
        <p class="flex gap-4 mb-4">
          <input
            id="back"
            class="basis-3/4 leading-5 border-2 rounded-2xl p-2 w-full"
            type="text"
            placeholder="Term"
            autocomplete="off"
          />
          <input
            id="back"
            class="basis-1/4 leading-5 border-2 rounded-2xl p-2 w-full"
            type="text"
            placeholder="Lang"
            autocomplete="off"
          />
        </p>
      </fieldset>
      <fieldset>
        <legend>Back</legend>
        <p class="flex gap-4 mb-4">
          <input
            id="back"
            class="basis-3/4 leading-5 border-2 rounded-2xl p-2 w-full"
            type="text"
            placeholder="Term"
            autocomplete="off"
          />
          <input
            id="back"
            class="basis-1/4 leading-5 border-2 rounded-2xl p-2 w-full"
            type="text"
            placeholder="Lang"
            autocomplete="off"
          />
        </p>
      </fieldset>
      <p class="text-right">
        <CommonButton
          before="save"
          class="bg-indigo-500 text-white"
          type="submit"
          >Generate</CommonButton
        >
      </p>
    </form>
  </div>
</template>
