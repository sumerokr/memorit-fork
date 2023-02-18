<script setup lang="ts">
import { computed } from "vue";
import CardList from "@/components/CardList.vue";
import { useGetCardsByCardSetId } from "@/composables/use-cards";
import { cardsByCardSetId } from "@/services/cards-storage";

type Props = {
  cardSetId: string;
};

const props = defineProps<Props>();

const { isLoading, isReady, execute } = useGetCardsByCardSetId();
execute(props.cardSetId);

const cards = computed(() => {
  return cardsByCardSetId.value[props.cardSetId];
});
</script>

<template>
  <div>
    <CardList v-if="isReady" :cards="cards" />
    <!-- what if error? -->
    <div v-else-if="isLoading">Loading...</div>
  </div>
</template>
