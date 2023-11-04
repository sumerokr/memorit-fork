<script setup lang="ts">
import { useAsyncState } from "@vueuse/core";
import { useRouter } from "vue-router";
import { getCardSetUC } from "@/application/get-card-set";
import { deleteCardSetUC } from "@/application/delete-card-set";
import IconButton from "@/components/IconButton.vue";
import RouterLinkIconButton from "@/components/RouterLinkIconButton.vue";
import LinearStats from "@/components/LinearStats.vue";

type Props = {
  cardSetId: string;
};

const props = defineProps<Props>();

const router = useRouter();

const { state: cardSetState, error: getCardSetError } = useAsyncState(
  () => getCardSetUC({ id: props.cardSetId }),
  null
);

const {
  isLoading: isDeleteCardSetLoading,
  execute: deleteCardSet,
  error: deleteCardSetError,
} = useAsyncState(() => deleteCardSetUC({ id: props.cardSetId }), null, {
  immediate: false,
  onSuccess: () => {
    router.replace({ name: "sets" });
  },
});

const handleDeleteCardSet = async () => {
  if (isDeleteCardSetLoading.value) {
    return;
  }
  const answer = confirm("Delete the Card set and all its cards?");
  if (!answer) {
    return;
  }
  await deleteCardSet();
};
</script>

<template>
  <div class="flex-grow flex flex-col p-4 bg-neutral-100">
    <div class="flex items-center mb-4">
      <RouterLinkIconButton icon="arrow_back" class="-ml-3 mr-1" :to="{ name: 'sets' }"
        >Back</RouterLinkIconButton
      >
      <div class="ml-auto -mr-3 relative" ref="searchContainerEl">
        <RouterLinkIconButton :to="{ name: 'card-set-edit', params: { cardSetId } }" icon="edit">
          Edit
        </RouterLinkIconButton>
        <IconButton icon="delete" @click="handleDeleteCardSet">Delete </IconButton>
      </div>
    </div>

    <div v-if="getCardSetError" class="mb-4 border border-red-500 rounded-2xl p-4 bg-red-50">
      {{ getCardSetError }}
    </div>

    <div v-if="cardSetState">
      <p v-if="deleteCardSetError" class="mb-4 border border-red-500 rounded-2xl p-4 bg-red-50">
        {{ deleteCardSetError }}
      </p>
      <h1 class="text-3xl mb-8">
        {{ cardSetState.cardSet.title }}
      </h1>

      <p class="mb-8 flex items-baseline justify-between opacity-60">
        <span>Cards: {{ cardSetState.cardsCount }}</span>
        <span
          >To study:
          <span
            class="inline-block px-1 py-0.5 rounded-md"
            :class="cardSetState.cardsToStudyCount > 0 ? 'bg-amber-300' : 'bg-amber-100'"
            >{{ cardSetState.cardsToStudyCount }}</span
          ></span
        >
      </p>

      <LinearStats class="mb-8" :progressMap="cardSetState.progressMap" />

      <ul class="bg-white rounded-2xl py-2 divide-y">
        <li>
          <RouterLink
            :to="{ name: 'cards', params: { cardSetId: props.cardSetId } }"
            class="flex items-start gap-1 px-1 py-2.5"
          >
            <IconButton icon="view_agenda" class="" />
            <div class="py-0.5">
              <h2 class="font-medium">View cards</h2>
              <p class="text-sm opacity-60">Review terms and definitions</p>
            </div>
          </RouterLink>
        </li>
        <li>
          <RouterLink
            :to="{ name: 'new-card', params: { cardSetId: props.cardSetId } }"
            class="flex items-start gap-1 px-1 py-2.5"
          >
            <IconButton icon="add" class="" />
            <div class="py-0.5">
              <h2 class="font-medium">Add cards</h2>
              <p class="text-sm opacity-60">Add more cards to this Card set</p>
            </div>
          </RouterLink>
        </li>
      </ul>

      <ul class="mt-4 bg-white rounded-2xl py-2 divide-y">
        <li>
          <RouterLink
            :to="{ name: 'study', params: { cardSetId: props.cardSetId } }"
            class="flex items-start gap-1 px-1 py-2.5"
          >
            <IconButton icon="school" class="" />
            <div class="py-0.5">
              <h2 class="font-medium">Remember or not</h2>
              <p class="text-sm opacity-60">Use the interval repetition technique</p>
            </div>
          </RouterLink>
        </li>
        <li>
          <RouterLink
            :to="{ name: 'oneOfFour', params: { cardSetId: props.cardSetId } }"
            class="flex items-start gap-1 px-1 py-2.5"
          >
            <IconButton icon="list" class="" />
            <div class="py-0.5">
              <h2 class="font-medium">Quiz 1/4</h2>
              <p class="text-sm opacity-60">Some description</p>
            </div>
          </RouterLink>
        </li>
      </ul>
    </div>
  </div>
</template>
