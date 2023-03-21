<script setup lang="ts">
import { ref } from "vue";
import { getCardSetUC } from "@/application/get-card-set";
import { updateCardSetUC } from "@/application/update-card-set";
import { useAsyncState } from "@vueuse/core";
import { useRouter } from "vue-router";
import CardSetForm from "@/components/CardSetForm.vue";

type Props = {
  cardSetId: string;
};

const props = defineProps<Props>();

const router = useRouter();

const title = ref("");

const { isLoading: isGetCardSetLoading } = useAsyncState(
  () => getCardSetUC({ id: props.cardSetId }),
  null,
  {
    onSuccess: async (data) => {
      if (!data) {
        return;
      }
      title.value = data.title;
    },
  }
);

const { isLoading: isUpdateCardSetLoading, execute: updateCardSet } =
  useAsyncState(updateCardSetUC, null, {
    immediate: false,
    onSuccess: () => {
      router.push({ name: "set", params: { cardSetId: props.cardSetId } });
    },
  });

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

    <CardSetForm
      v-model:title.trim="title"
      :is-loading="isUpdateCardSetLoading"
      @submit="onSubmit"
    />
  </div>
</template>
