<script setup lang="ts">
import { ref, nextTick } from "vue";
import { useCreateCard } from "@/composables/use-cards";
import { useRoute } from "vue-router";
const route = useRoute();
const cardSetId = route.params.id as string;

const { isLoading: isCreateCardLoading, execute: createCard } = useCreateCard();

const front = ref("");
const back = ref("");
const frontElement = ref<HTMLInputElement | null>(null);

const onSubmit = async () => {
  createCard({ front: front.value, back: back.value, cardSetId });
  front.value = "";
  back.value = "";
  await nextTick();
  frontElement.value?.focus();
};
</script>

<template>
  <div>
    <form @submit.prevent="onSubmit">
      <input v-model="front" type="text" ref="frontElement" />
      <input v-model="back" type="text" />
      <button type="submit" :disabled="isCreateCardLoading">add</button>
    </form>
  </div>
</template>

<style scoped></style>
