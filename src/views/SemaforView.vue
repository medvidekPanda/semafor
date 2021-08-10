<template>
  <el-main>
    <SemaforComp />
    <ResultsListComp />
    <el-button type="primary" @click="submitFormDialog = true"
      >Odeslat výsledky</el-button
    >

    <el-dialog
      title="Odeslat výsledky"
      v-model="submitFormDialog"
      fullscreen="true"
    >
      <NewResultFormComp />
    </el-dialog>
  </el-main>
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
  data() {
    return {
      submitFormDialog: false,
    };
  },
});
</script>

<style scoped lang="scss">
.el-main {
  display: flex;
  max-width: 768px;
  flex-direction: column;
  justify-content: flex-start;
  align-items: stretch;
  gap: 24px;
}

@media (min-width: 769px) and (-webkit-min-device-pixel-ratio: 2),
  (min-width: 769px) and (min-resolution: 192dpi) {
  .el-main {
    align-items: center;
    justify-content: center;
  }
}
</style>
