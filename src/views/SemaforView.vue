<template>
  <el-main>
    <section class="main-section">
      <SemaforComp />
      <ResultsListComp />
      <NewResultFormComp class="result-form flex-3" />
    </section>
    <footer class="footer">
      <el-button
        type="primary"
        @click="submitFormDialog = true"
        :disabled="!isFinished"
      >
        Odeslat výsledky
      </el-button>
    </footer>

    <el-dialog
      title="Odeslat výsledky"
      v-model="submitFormDialog"
      :fullscreen="windowWidth < 600"
    >
      <NewResultFormComp />
    </el-dialog>
  </el-main>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { Store } from "vuex";

import NewResultFormComp from "@/components/semafor/NewResultFormComp.vue";
import { ResultPost } from "@/types/state/results-post.model";
import ResultsListComp from "@/components/semafor/ResultsListComp.vue";
import SemaforComp from "@/components/semafor/SemaforComp.vue";

export default defineComponent({
  name: "Semafor",
  beforeUnmount() {
    window.removeEventListener("resize", this.onResize);
  },
  components: {
    NewResultFormComp,
    SemaforComp,
    ResultsListComp,
  },
  computed: {
    isFinished(): Store<ResultPost> {
      return this.$store.state.isFinished;
    },
    windowWidth(): Store<ResultPost> {
      return this.$store.getters.windowWidth;
    },
  },
  data() {
    return {
      submitFormDialog: false,
      fill: true,
    };
  },
  methods: {
    onResize() {
      this.$store.dispatch("getWindowWidth", window.innerWidth);
    },
  },
  mounted() {
    this.onResize();
    this.$nextTick(() => {
      window.addEventListener("resize", this.onResize);
    });
  },
});
</script>

<style scoped lang="scss">
.el-main {
  flex-direction: column;
  justify-content: flex-start;
  align-items: stretch;
  gap: 24px;
}

.el-main,
.footer,
.main-section {
  display: flex;
  overflow: hidden;
}

.footer {
  flex: 0 0 auto;
}

@media (max-width: 959.99px) {
  .el-main {
    max-width: 768px;
  }

  .main-section {
    flex: 1 1 0;
  }

  .footer,
  .main-section {
    flex-direction: column;
  }

  .result-form {
    display: none;
  }
}

@media (min-width: 960px) {
  .el-main {
    align-items: center;
    justify-content: center;
  }

  .main-section {
    flex-direction: row;
    // max-width: 1280px;
    width: 960px;
    gap: 40px;
  }

  .footer {
    display: none;
  }

  .result-form {
    flex-direction: column;
  }
}
</style>
