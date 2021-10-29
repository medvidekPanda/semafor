<template>
  <div
    class="flex-2 overflow-y"
    :class="{
      'margin-top-4 margin-bottom-1': windowWidth < 960,
    }"
  >
    <el-space
      v-if="getResultsStore"
      wrap
      :size="size"
      direction="vertical"
      alignment="start"
      class="no-margin"
    >
      <h3 class="no-margin">
        Průměrný čas: {{ getResultsStore?.roundedValue }}ms
      </h3>
      <h3 class="no-margin">
        Průměrný čas korigovaný: {{ getResultsStore?.roundedValueCorrected }}ms
      </h3>
      <ul v-if="getResultsStore" class="list">
        <el-space wrap :size="size" direction="vertical" alignment="start">
          <li v-for="result in getResultsStore.rounds" :key="result.value">
            <el-space wrap :size="size">
              <h4 class="no-margin" v-if="result.round">
                {{ result.round }}. kolo
              </h4>
              <h4 class="no-margin" v-if="result.value">
                {{ result.value }} ms
              </h4>
            </el-space>
          </li>
        </el-space>
      </ul>
      <el-space
        v-if="getCompareMessage"
        direction="vertical"
        alignment="start"
        class="no-margin padding-top-3"
      >
        <h4 class="no-margin">{{ getCompareMessage }}</h4>
        <p class="no-margin padding-top-1">
          Výsledek je braný z korigovaného průměru, kdy jedna nejnižší a
          nejvyšší hodnota nejsou započítány do průměru.
        </p>
      </el-space>
    </el-space>
    <h4 class="no-margin" v-else>Zatím žádné výsledky</h4>
    <el-button
      class="margin-top-1"
      v-if="getResultsStore?.rounds.length > 4 && !getCompareMessage"
      v-on:click="compareResults()"
      type="primary"
      plain
      :loading="!getCompareMessage && clicked"
      style="width: 100%"
      >Porovnat Výsledky</el-button
    >
  </div>
</template>

<script lang="ts">
import SemaforResult from "@/types/results/results-semafor";
import { defineComponent } from "vue";

export default defineComponent({
  name: "ResultsListComp",
  data() {
    return {
      size: 8,
      clicked: false,
    };
  },
  computed: {
    getCompareMessage(): string {
      return this.$store.getters.getCompareMessage;
    },
    getResultsStore(): SemaforResult {
      const store = this.$store.getters.getResults;
      return store && store[this.isMobile ? "mobile" : "desktop"];
    },
    isMobile(): boolean {
      return this.$store.getters.isMobile;
    },
    windowWidth(): number {
      return this.$store.getters.windowWidth;
    },
  },
  methods: {
    compareResults() {
      this.clicked = true;
      this.$store.dispatch("getDocsById", {
        commitName: "findClosest",
        docId: ["values-rounded-corrected"],
      });

      setTimeout(() => {
        this.clicked = false;
      }, 3000);
    },
  },
});
</script>

<style scoped lang="scss">
.list {
  margin: 0;
  list-style: none;
  padding-inline-start: 0;
}
</style>
