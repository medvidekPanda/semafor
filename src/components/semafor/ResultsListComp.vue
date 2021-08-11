<template>
  <el-space v-if="getResultsStore" wrap :size="size" direction="vertical" alignment="start">
    <h3 class="no-margin">
      Průměrný čas: {{ getResultsStore?.roundedValue }}ms
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
  </el-space>
  <h4 class="no-margin" v-else>Zatím žádné výsledky</h4>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { Device } from "@capacitor/device";
import { Store } from "vuex";

import ResultPost from "@/types/results-post.model";

let isMobile: boolean;

export default defineComponent({
  name: "ResultsListComp",
  async mounted() {
    const info = await Device.getInfo();
    isMobile = info.operatingSystem === "ios" || info.operatingSystem === "android";
  },
  data() {
    return {
      size: 16,
    };
  },
  computed: {
    getResultsStore(): Store<ResultPost> {
      const store = this.$store.state.results;
      return store && store[isMobile ? 'mobile' : 'desktop'];
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
