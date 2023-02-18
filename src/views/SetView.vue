<script setup lang="ts">
import { ref, computed, watch, nextTick } from "vue";
import { useRoute, useRouter } from "vue-router";
import {
  useDeleteCardSet,
  useUpdateCardSet,
  useGetCardSetById,
} from "@/composables/use-card-sets";
import { useGetCardsByCardSetId, useCreateCard } from "@/composables/use-cards";
import { cardSets } from "@/services/card-sets-storage";
import { cards } from "@/services/cards-storage";

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
    const cardsByCardSetId = cards.value.filter(
      (card) => card.cardSetId === cardSetId
    );
    return cardsByCardSetId.slice().reverse();
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
  if (!front.value.trim() || !back.value.trim()) {
    return;
  }
  await createCard({ front: front.value, back: back.value, cardSetId });
  front.value = "";
  back.value = "";
  frontElement.value?.focus();
};
//#endregion
</script>

<template>
  <div>
    <div style="padding: 1rem">
      <RouterLink :to="{ name: 'sets' }">← Back to card sets</RouterLink>
    </div>
    <hr />
    <div v-if="isGetCardSetByIdReady && cardSet">
      <div class="form-container">
        <form class="form" @submit.prevent="onSubmit">
          <input
            v-model="title"
            class="input"
            type="text"
            ref="titleElement"
            :readonly="!isTitleEditing"
          />
          <button
            v-if="!isTitleEditing"
            class="button"
            type="button"
            @click="onStartEdit"
          >
            Edit
          </button>
          <button
            v-if="isTitleEditing"
            class="button"
            type="submit"
            :disabled="isUpdateCardSetLoading"
          >
            Save
          </button>
          <button
            v-if="isTitleEditing"
            class="button"
            type="button"
            @click="onReset"
          >
            Cancel
          </button>
        </form>
        <p style="margin-bottom: 0">
          <RouterLink
            :to="{ name: 'play', params: { cardSetId: cardSetId } }"
            class="button"
            >Play</RouterLink
          >
          ||
          <button class="button" type="button" @click="onDelete">Delete</button>
        </p>
      </div>
      <hr />

      <form class="cards-form" @submit.prevent="onCardSave">
        <div>
          <label for="front">Front</label>
          <input
            v-model="front"
            id="front"
            class="input"
            type="text"
            ref="frontElement"
          />
        </div>
        <div>
          <label for="back">Back</label
          ><input v-model="back" id="back" class="input" type="text" />
        </div>
        <div>
          <button type="submit" class="button" :disabled="isCreateCardLoading">
            add
          </button>
        </div>
      </form>
      <hr />

      <template v-if="isGetCardsReady">
        <TransitionGroup
          v-if="reversedCards.length"
          class="cards"
          name="list"
          tag="ul"
        >
          <li v-for="card in reversedCards" :key="card.id">
            <div class="card">
              <span>{{ card.front }}</span
              ><span>{{ card.back }} </span>
              <div
                class="progress"
                :style="{ width: `${card.progress * 10}%` }"
              ></div>
            </div>
          </li>
        </TransitionGroup>
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
.form-container {
  padding: 1rem;
}

.cards {
  display: grid;
  gap: 1rem;
  padding-left: 0;
  list-style: none;
  overflow: hidden;
}

.card {
  border-bottom: 1px solid rgba(0, 0, 0, 0.2);
  padding: 1rem;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 2;
  gap: 1rem;
}

.progress {
  height: 0.25rem;
  background-color: lightgreen;
  grid-column: 1/3;
}

.input,
.button {
  margin: 0;
  border: 1px solid gray;
  border-radius: 0.5rem;
  padding: 0.5rem;
  font-size: 1rem;
  line-height: 1.5;
  text-decoration: none;
  color: inherit;
  display: inline-block;
}

.input[readonly] {
  border-color: transparent;
  font-weight: 700;
}

.cards-form {
  display: grid;
  align-items: end;
  grid-template-columns: 2fr 2fr 1fr;
  padding: 1rem;
}

.cards-form .input,
.cards-form .button {
  width: 100%;
}

.list-move,
.list-enter-active,
.list-leave-active {
  transition: all 0.25s ease-out;
}
.list-enter-from,
.list-leave-to {
  transform: translateY(-100%);
}
</style>
