<script setup lang="ts">
import { computed } from "vue";
import CommonButton from "@/components/CommonButton.vue";
import RouterLinkCommonButton from "@/components/RouterLinkCommonButton.vue";
import type { CardSetV2 } from "@/domain/card-set";

type Props = {
  cardSetId: CardSetV2["id"];
  results: [number, number, number];
};

const props = defineProps<Props>();

const emit = defineEmits(["restart"]);

const total = computed(() => {
  return props.results.reduce((acc, count) => {
    return acc + count;
  }, 0);
});
</script>

<template>
  <div class="flex-grow flex flex-col gap-4">
    <div class="flex-grow flex flex-col justify-center">
      <h2 class="text-5xl font-medium text-center mb-8">Well done!</h2>
      <p class="mb-2 text-center">You have studied {{ total }} cards.</p>
      <div
        class="flex h-4 border-2 border-neutral-500 rounded-xl overflow-hidden"
      >
        <div
          class="bg-red-200 text-xs"
          :style="`width: ${(results[0] / total) * 100}%`"
        ></div>
        <div
          class="bg-yellow-200"
          :style="`width: ${(results[1] / total) * 100}%`"
        ></div>
        <div
          class="bg-green-200"
          :style="`width: ${(results[2] / total) * 100}%`"
        ></div>
      </div>
    </div>

    <p class="flex flex-col gap-4 mb-4">
      <RouterLinkCommonButton
        :to="{ name: 'set', params: { cardSetId } }"
        before="arrow_back"
        class="flex-grow bg-indigo-500 text-white"
        @click="emit('restart')"
        >Back to set
      </RouterLinkCommonButton>
      <CommonButton
        before="school"
        class="flex-grow bg-indigo-200"
        @click="emit('restart')"
        >Study again
      </CommonButton>
    </p>
  </div>
</template>
