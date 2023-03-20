<script setup lang="ts">
import { ref } from "vue";
import { useAsyncState, onClickOutside } from "@vueuse/core";
import { useRouter } from "vue-router";
import { getCardSetUC } from "@/application/get-card-set";
import { deleteCardSetUC } from "@/application/delete-card-set";
import IconButton from "@/components/IconButton.vue";
import CommonButton from "@/components/CommonButton.vue";
import RouterLinkCommonButton from "@/components/RouterLinkCommonButton.vue";

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
  await deleteCardSet();
};

const isMenuOpen = ref(false);
const menuRef = ref(null);

onClickOutside(menuRef, () => {
  isMenuOpen.value = false;
});
</script>

<template>
  <div class="flex-grow flex flex-col p-4 bg-neutral-100">
    <p class="mb-4">
      <RouterLink :to="{ name: 'sets' }" class="text-indigo-500"
        ><span class="inline-block rotate-180">➜</span> Back to card
        sets</RouterLink
      >
    </p>

    <div
      v-if="isGetCardSetReady && cardSet"
      class="border rounded-xl p-4 bg-white"
    >
      <div class="flex justify-between gap-4 mb-4">
        <h1 class="text-2xl">{{ cardSet.title }}</h1>
        <div class="relative leading-none" ref="menuRef">
          <IconButton
            icon="more_vert"
            class="flex -m-2 p-2 rounded-2xl"
            @click="isMenuOpen = !isMenuOpen"
          />
          <div
            v-if="isMenuOpen"
            class="flex gap-2 absolute -top-2 mr-4 right-full"
          >
            <CommonButton
              before="delete"
              class="bg-red-100"
              :disabled="isDeleteCardSetLoading"
              @click="onDelete"
            >
              Delete
            </CommonButton>
            <RouterLinkCommonButton
              :to="{ name: 'card-set-edit', params: { cardSetId } }"
              before="edit"
              class="bg-indigo-100"
            >
              Edit
            </RouterLinkCommonButton>
          </div>
        </div>
      </div>
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

      <div class="flex flex-wrap gap-4">
        <RouterLinkCommonButton
          :to="{ name: 'cards', params: { cardSetId: props.cardSetId } }"
          before="view_agenda"
          class="bg-indigo-50 flex-grow"
        >
          View
        </RouterLinkCommonButton>
        <RouterLinkCommonButton
          :to="{ name: 'new-card', params: { cardSetId: props.cardSetId } }"
          before="add"
          class="bg-indigo-50 flex-grow"
        >
          Add
        </RouterLinkCommonButton>
        <RouterLinkCommonButton
          :to="{ name: 'study', params: { cardSetId: props.cardSetId } }"
          before="play_arrow"
          class="bg-indigo-200 flex-grow"
        >
          Study
        </RouterLinkCommonButton>
      </div>
    </div>

    <div v-else-if="isGetCardSetLoading">Loading...</div>
  </div>
</template>
