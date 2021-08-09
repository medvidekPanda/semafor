<template>
  <div class="semafor">
    <el-main style="display: flex; flex-direction: column; justify-content: center; gap: 24px;">
      <SemaforComp />
      <ResultsListComp />
      <NewResultFormComp />
    </el-main>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import NewResultFormComp from "@/components/semafor/NewResultFormComp.vue";
import SemaforComp from "@/components/semafor/SemaforComp.vue";
import ResultsListComp from "@/components/semafor/ResultsListComp.vue";

export default defineComponent({
  name: "Semafor",
  components: {
    NewResultFormComp,
    SemaforComp,
    ResultsListComp,
  },
});
</script>

<style scoped lang="scss">
.semafor {
  max-width: 600px;
}
</style>
