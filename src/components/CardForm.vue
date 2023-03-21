<script setup lang="ts">
import { ref, watch, computed, onMounted } from "vue";
import type { Card } from "@/domain/card";
import CommonButton from "@/components/CommonButton.vue";

type Props = {
  front: Card["front"];
  back: Card["back"];
  isLoading: boolean;
};

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: "update:front", front: Props["front"]): void;
  (e: "update:back", back: Props["back"]): void;
  (e: "submit"): void;
}>();

const front = computed({
  get: () => props.front,
  set: (value) => emit("update:front", value),
});
const back = computed({
  get: () => props.back,
  set: (value) => emit("update:back", value),
});

const frontEl = ref<HTMLInputElement>();

onMounted(() => {
  frontEl.value?.focus();
});

const onSubmit = async () => {
  emit("submit");
};

watch([front, back], (values) => {
  if (values.every((value) => value === "")) {
    frontEl.value?.focus();
  }
});
</script>

<template>
  <form class="mb-4 border rounded-xl p-4 bg-white" @submit.prevent="onSubmit">
    <p class="mb-4">
      <input
        v-model="front"
        id="front"
        class="leading-5 border-2 rounded-2xl p-2 w-full"
        type="text"
        placeholder="Card front"
        autocomplete="off"
        ref="frontEl"
      />
    </p>
    <p class="mb-4">
      <input
        v-model="back"
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
        class="bg-indigo-200"
        type="submit"
        :disabled="isLoading"
        >Save</CommonButton
      >
    </p>
  </form>
</template>
