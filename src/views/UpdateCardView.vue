<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { getCardUC } from "@/application/get-card";
import { updateCardUC } from "@/application/update-card";
import { useAsyncState } from "@vueuse/core";
import { useRouter } from "vue-router";
import CardForm from "@/components/CardForm.vue";
import RouterLinkIconButton from "@/components/RouterLinkIconButton.vue";

type Props = {
  cardSetId: string;
  id: string;
};

const props = defineProps<Props>();

const router = useRouter();

const front = ref("");
const back = ref("");

const { isLoading: isGetCardLoading } = useAsyncState(
  () => getCardUC({ id: props.id }),
  null,
  {
    onSuccess: async (data) => {
      if (!data) {
        return;
      }
      front.value = data.front;
      back.value = data.back;
    },
  }
);

const { isLoading: isUpdateCardLoading, execute: updateCard } = useAsyncState(
  updateCardUC,
  null,
  {
    immediate: false,
    onSuccess: () => {
      router.push({ name: "cards", params: { cardSetId: props.cardSetId } });
    },
  }
);

const onSubmit = async () => {
  await updateCard(0, {
    id: props.id,
    data: {
      front: front.value,
      back: back.value,
    },
  });
};
</script>

<template>
  <div class="flex flex-col flex-grow p-4 bg-neutral-100">
    <div class="flex items-center mb-4">
      <RouterLinkIconButton
        icon="arrow_back"
        class="-ml-3 mr-1"
        :to="{ name: 'cards', params: { cardSetId } }"
        >Back</RouterLinkIconButton
      >
      <h1 class="text-2xl">Update card</h1>
    </div>

    <div v-if="isGetCardLoading">Loading...</div>

    <CardForm
      v-model:front.trim="front"
      v-model:back.trim="back"
      :is-loading="isUpdateCardLoading"
      @submit="onSubmit"
    />
  </div>
</template>
