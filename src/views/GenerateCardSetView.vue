<script setup lang="ts">
import { ref } from "vue";
import { useAsyncState } from "@vueuse/core";
import RouterLinkIconButton from "@/components/RouterLinkIconButton.vue";
import CommonButton from "@/components/CommonButton.vue";

const formEl = ref<HTMLFormElement | null>(null);
const getFormData = () => new FormData(formEl.value!);

const fetcher = () =>
  fetch(import.meta.env.VITE_GENERATOR_API, {
    method: "POST",
    body: getFormData(),
  }).then(async (res) => {
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error);
    }
    return data;
  });

const { isLoading, isReady, state, error, execute } = useAsyncState(
  fetcher,
  null,
  {
    immediate: false,
  }
);

const onSubmit = () => {
  if (
    !formEl.value?.topic.value ||
    !formEl.value?.count.value ||
    !formEl.value?.["front-term"].value ||
    !formEl.value?.["back-term"].value ||
    formEl.value?.pin.value !== "735"
  ) {
    return;
  }

  execute();
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

    <form ref="formEl" @submit.prevent="onSubmit">
      <!-- <p class="mb-4">
        <input
          name="topic"
          class="leading-5 border-2 rounded-2xl p-2 w-full"
          type="text"
          placeholder="Card set name"
          autocomplete="off"
        />
      </p> -->
      <p class="flex gap-4 mb-4">
        <input
          name="topic"
          class="basis-3/4 leading-5 border-2 rounded-2xl p-2 w-full"
          type="text"
          placeholder="Topic"
          autocomplete="off"
        />
        <input
          name="count"
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
            name="front-term"
            class="basis-3/4 leading-5 border-2 rounded-2xl p-2 w-full"
            type="text"
            placeholder="Term"
            autocomplete="off"
          />
          <input
            name="front-lang"
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
            name="back-term"
            class="basis-3/4 leading-5 border-2 rounded-2xl p-2 w-full"
            type="text"
            placeholder="Term"
            autocomplete="off"
          />
          <input
            name="back-lang"
            class="basis-1/4 leading-5 border-2 rounded-2xl p-2 w-full"
            type="text"
            placeholder="Lang"
            autocomplete="off"
          />
        </p>
      </fieldset>
      <p class="mb-4">
        <input
          name="pin"
          class="leading-5 border-2 rounded-2xl p-2 w-full"
          type="text"
          placeholder="PIN"
          autocomplete="off"
        />
      </p>
      <p class="text-right">
        <CommonButton
          before="save"
          class="bg-indigo-500 text-white"
          type="submit"
          :disabled="isLoading"
          >Generate</CommonButton
        >
      </p>
    </form>

    <div v-if="error">{{ error }}</div>
    <div v-else-if="isLoading">Loading...</div>
    <pre v-else-if="isReady && state">{{ JSON.stringify(state, null, 2) }}</pre>
  </div>
</template>
