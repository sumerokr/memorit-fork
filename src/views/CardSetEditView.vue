<script setup lang="ts">
import { ref, nextTick } from "vue";
import { getCardSetUC } from "@/application/get-card-set";
import { setupUpdateCardSetUC } from "@/application/update-card-set";
import { useAsyncState } from "@vueuse/core";
import { useRouter } from "vue-router";

type Props = {
  cardSetId: string;
};

const props = defineProps<Props>();

const router = useRouter();

const title = ref("");
const titleEl = ref<HTMLInputElement>();

const { isLoading: isGetCardSetLoading, isReady: isGetCardSetReady } =
  useAsyncState(() => getCardSetUC({ id: props.cardSetId }), null, {
    onSuccess: async (data) => {
      if (!data) {
        return;
      }
      await nextTick();
      title.value = data.title;
      titleEl.value?.focus();
    },
  });

const updateCardSetUC = setupUpdateCardSetUC({
  onSucces: () => {
    router.push({ name: "set", params: { cardSetId: props.cardSetId } });
  },
});

const { isLoading: isUpdateCardSetLoading, execute: updateCardSet } =
  useAsyncState(updateCardSetUC, null, { immediate: false });

const onSubmit = async () => {
  await updateCardSet(0, {
    id: props.cardSetId,
    data: {
      title: title.value,
    },
  });
};
</script>

<template>
  <div class="flex flex-col flex-grow p-4 bg-neutral-100">
    <p class="mb-4">
      <RouterLink
        :to="{ name: 'set', params: { cardSetId } }"
        class="text-indigo-500"
        ><span class="inline-block rotate-180">➜</span> Back to card
        set</RouterLink
      >
    </p>

    <h1 class="text-3xl mb-4">Edit card set</h1>

    <div v-if="isGetCardSetLoading">Loading...</div>

    <form
      v-if="isGetCardSetReady"
      class="border rounded-xl mb-4 p-4 bg-white"
      @submit.prevent="onSubmit"
    >
      <p class="mb-4">
        <input
          v-model="title"
          id="title"
          class="leading-5 border-2 rounded-2xl p-2 w-full"
          type="text"
          placeholder="Card set title"
          autocomplete="off"
          ref="titleEl"
        />
      </p>
      <p class="text-right">
        <button
          class="inline-flex justify-center gap-2 px-4 py-2 items-center bg-indigo-200 rounded-2xl"
          type="submit"
          :disabled="isUpdateCardSetLoading"
        >
          <span>Save</span>
          <span class="material-symbols-outlined text-xl leading-none">
            save
          </span>
        </button>
      </p>
    </form>
  </div>
</template>
