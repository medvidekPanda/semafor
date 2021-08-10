<template>
  <el-space wrap :size="size" direction="vertical" alignment="start">
    <h3 class="no-margin">
      Průměrný čas:
      {{ getResultsStore?.roundedValue }}
      <template v-if="getResultsStore && getResultsStore.roundedValue">ms</template>
      <template v-else>žádný</template>
    </h3>
    <ul v-if="getResultsStore" class="list">
      <el-space wrap :size="size" direction="vertical" alignment="start">
        <li v-for="result in getResultsStore.rounds" :key="result.value">
          <el-space wrap :size="size">
            <h4 class="no-margin" v-if="result.round">
              {{ result.round }}. kolo
            </h4>
            <h4 class="no-margin" v-if="result.value">{{ result.value }} ms</h4>
          </el-space>
        </li>
      </el-space>
    </ul>
    <h4 class="no-margin" v-else>Zatím žádné výsledky</h4>
  </el-space>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { Store } from "vuex";

import ResultPost from "@/types/results-post.model";

export default defineComponent({
  name: "ResultsListComp",
  data() {
    return {
      size: 16,
    };
  },
  computed: {
    getResultsStore(): Store<ResultPost> {
      return this.$store.state.results;
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
