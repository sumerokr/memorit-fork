<script setup lang="ts">
import { ref, watch, computed, onMounted } from "vue";
import type { CardSet } from "@/domain/card-set";
import CommonButton from "@/components/CommonButton.vue";

type Props = {
  title: CardSet["title"];
  isLoading: boolean;
};

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: "update:title", title: Props["title"]): void;
  (e: "submit"): void;
}>();

const title = computed({
  get: () => props.title,
  set: (value) => emit("update:title", value),
});

const titleEl = ref<HTMLInputElement>();

onMounted(() => {
  titleEl.value?.focus();
});

const onSubmit = async () => {
  emit("submit");
};

watch(title, (newTitle) => {
  if (newTitle === "") {
    titleEl.value?.focus();
  }
});
</script>

<template>
  <form class="border rounded-xl mb-4 p-4 bg-white" @submit.prevent="onSubmit">
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
      <CommonButton
        before="save"
        class="bg-indigo-500 text-white"
        type="submit"
        :disabled="isLoading"
        >Save</CommonButton
      >
    </p>
  </form>
</template>
