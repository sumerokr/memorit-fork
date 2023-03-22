<script setup lang="ts">
import { ref } from "vue";
import { useAsyncState, onClickOutside } from "@vueuse/core";
import { useRouter } from "vue-router";
import { getCardSetUC } from "@/application/get-card-set";
import { deleteCardSetUC } from "@/application/delete-card-set";
import IconButton from "@/components/IconButton.vue";
import CommonButton from "@/components/CommonButton.vue";
import RouterLinkCommonButton from "@/components/RouterLinkCommonButton.vue";
import RouterLinkIconButton from "@/components/RouterLinkIconButton.vue";

type Props = {
  cardSetId: string;
};

const props = defineProps<Props>();

const router = useRouter();

const {
  state: cardSet,
  isLoading: isGetCardSetLoading,
  isReady: isGetCardSetReady,
} = useAsyncState(() => getCardSetUC({ id: props.cardSetId }), null);

const { isLoading: isDeleteCardSetLoading, execute: deleteCardSet } =
  useAsyncState(() => deleteCardSetUC({ id: props.cardSetId }), null, {
    immediate: false,
    onSuccess: () => {
      router.replace({ name: "sets" });
    },
  });

const onDelete = async () => {
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
      <RouterLinkIconButton
        icon="arrow_back"
        class="-ml-3 mr-1"
        :to="{ name: 'sets' }"
        >Back</RouterLinkIconButton
      >
      <div class="ml-auto -mr-3 relative" ref="searchContainerEl">
        <RouterLinkIconButton
          :to="{ name: 'card-set-edit', params: { cardSetId } }"
          icon="edit"
        >
          Edit
        </RouterLinkIconButton>
        <IconButton
          icon="delete"
          :disabled="isDeleteCardSetLoading"
          @click="onDelete"
        >
          Delete
        </IconButton>
      </div>
    </div>

    <div v-if="isGetCardSetReady && cardSet">
      <h1 class="text-3xl mb-8">
        {{ cardSet.title }}
      </h1>

      <p class="mb-8 flex items-baseline justify-between opacity-60">
        <span>Cards: {{ cardSet.cardsCount }}</span>
        <span
          >To study:
          <span
            class="inline-block px-1 py-0.5 rounded-md"
            :class="
              cardSet.cardsToStudyCount > 0 ? 'bg-amber-300' : 'bg-amber-100'
            "
            >{{ cardSet.cardsToStudyCount }}</span
          ></span
        >
      </p>

      <ul class="divide-y">
        <li>
          <RouterLink
            :to="{ name: 'cards', params: { cardSetId: props.cardSetId } }"
            class="flex gap-1 py-2.5"
          >
            <IconButton icon="view_agenda" class="-ml-1" />
            <div>
              <h2>View cards</h2>
              <p class="text-sm opacity-60">Review terms and definitions</p>
            </div>
          </RouterLink>
        </li>
        <li>
          <RouterLink
            :to="{ name: 'new-card', params: { cardSetId: props.cardSetId } }"
            class="flex gap-1 py-2.5"
          >
            <IconButton icon="add" class="-ml-1" />
            <div>
              <h2>Add cards</h2>
              <p class="text-sm opacity-60">Add more cards to this Card set</p>
            </div>
          </RouterLink>
        </li>
        <li>
          <RouterLink
            :to="{ name: 'study', params: { cardSetId: props.cardSetId } }"
            class="flex gap-1 py-2.5"
          >
            <IconButton icon="school" class="-ml-1" />
            <div>
              <h2>Study</h2>
              <p class="text-sm opacity-60">
                Use the interval repetition technique
              </p>
            </div>
          </RouterLink>
        </li>
      </ul>
    </div>

    <div v-else-if="isGetCardSetLoading">Loading...</div>
  </div>
</template>
