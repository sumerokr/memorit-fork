<script setup lang="ts">
import { ref, computed, watch, nextTick } from "vue";
import { useRoute, useRouter } from "vue-router";
import {
  useDeleteCardSet,
  useUpdateCardSet,
  useGetCardSetById,
} from "@/composables/use-card-sets";
import { useGetCardsByCardSetId, useCreateCard } from "@/composables/use-cards";
import { cardSets } from "@/services/card-set-storage";
import { cardsByCardSetId } from "@/services/cards-storage";

//#region cardSet
const route = useRoute();
const router = useRouter();
const cardSetId = route.params.id as string;

const {
  isReady: isGetCardSetByIdReady,
  isLoading: isGetCardSetByIdLoading,
  execute: getCardSetById,
} = useGetCardSetById();
getCardSetById(cardSetId);
const cardSet = computed(() => {
  return cardSets.value.find((cardSet) => cardSet.id === cardSetId);
});
const reversedCards = computed(() => {
  if (cardSet.value) {
    return cardsByCardSetId.value[cardSet.value.id].slice().reverse();
  }
  return [];
});

const title = ref("");
if (cardSet.value) {
  title.value = cardSet.value.title;
} else {
  const unwatch = watch(cardSet, (newVal) => {
    if (newVal) {
      title.value = newVal.title;
      unwatch();
    }
  });
}

const titleElement = ref<HTMLInputElement | null>(null);
const isTitleEditing = ref(false);
const onStartEdit = async () => {
  if (!cardSet.value) {
    return;
  }
  title.value = cardSet.value.title;
  isTitleEditing.value = true;
  await nextTick();
  titleElement.value?.focus();
};

const { isLoading: isUpdateCardSetLoading, execute: updateCardSet } =
  useUpdateCardSet();
const onSubmit = async () => {
  if (!cardSet.value) {
    return;
  }
  await updateCardSet({ ...cardSet.value, ...{ title: title.value } });
  isTitleEditing.value = false;
  title.value = cardSet.value.title;
};

const { isLoading: isDeleteCardSetLoading, execute: deleteCardSet } =
  useDeleteCardSet();
const onDelete = async () => {
  if (!cardSet.value) {
    return;
  }
  await deleteCardSet(cardSet.value.id);
  router.push({ name: "sets" });
};

const onReset = async () => {
  if (!cardSet.value) {
    return;
  }
  title.value = cardSet.value.title;
  isTitleEditing.value = false;
};
//#endregion

//#region cards
const front = ref("");
const back = ref("");
const frontElement = ref<HTMLInputElement | null>(null);

const { isLoading: isCreateCardLoading, execute: createCard } = useCreateCard();

const {
  isReady: isGetCardsReady,
  isLoading: isGetCardsLoading,
  execute: getCards,
} = useGetCardsByCardSetId();
getCards(cardSetId);

const onCardSave = async () => {
  await createCard({ front: front.value, back: back.value, cardSetId });
  front.value = "";
  back.value = "";
  frontElement.value?.focus();
};
//#endregion
</script>

<template>
  <div>
    <div v-if="isGetCardSetByIdReady && cardSet">
      <form @submit.prevent="onSubmit">
        <input
          v-model="title"
          type="text"
          ref="titleElement"
          :readonly="!isTitleEditing"
        />
        <button v-if="!isTitleEditing" type="button" @click="onStartEdit">
          edit
        </button>
        <button
          v-if="isTitleEditing"
          type="submit"
          :disabled="isUpdateCardSetLoading"
        >
          save
        </button>
        <button v-if="isTitleEditing" type="button" @click="onReset">
          reset
        </button>
        <button type="button" @click="onDelete">delete</button>
      </form>
      <hr />
      <form @submit.prevent="onCardSave">
        <input v-model="front" type="text" ref="frontElement" />
        <input v-model="back" type="text" />
        <button type="submit" :disabled="isCreateCardLoading">add</button>
      </form>
      <hr />
      <template v-if="isGetCardsReady">
        <ul v-if="reversedCards.length" class="cards">
          <li v-for="card in reversedCards" :key="card.id">
            <p class="card">
              <span>{{ card.front }}</span
              ><span>{{ card.back }} </span>
            </p>
          </li>
        </ul>
        <div v-else>Nothing</div>
      </template>
      <p v-else-if="isGetCardsLoading">Loading...</p>
      <p v-else>Error?</p>
    </div>
    <div v-else-if="isGetCardSetByIdLoading" :disabled="isDeleteCardSetLoading">
      Loading...
    </div>
    <div v-else>Error?</div>
  </div>
</template>

<style scoped>
.cards {
  padding-left: 0;
  list-style: none;
}

.card {
  border: 1px solid rgba(0, 0, 0, 0.2);
  padding: 1rem;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}
</style>
