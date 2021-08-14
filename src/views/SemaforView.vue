<template>
  <el-main>
    <section class="main-section">
      <SemaforComp />
      <ResultsListComp />
      <section class="result-form">
        <NewResultFormComp />
      </section>
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
      :fullscreen="windowWidth < 960"
    >
      <NewResultFormComp />
    </el-dialog>
  </el-main>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { Store } from "vuex";

import NewResultFormComp from "@/components/semafor/NewResultFormComp.vue";
import ResultPost from "@/types/results-post.model";
import ResultsListComp from "@/components/semafor/ResultsListComp.vue";
import SemaforComp from "@/components/semafor/SemaforComp.vue";

export default defineComponent({
  name: "Semafor",
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
      return this.$store.state.windowWidth
    }
  },
  data() {
    return {
      submitFormDialog: false,
      fill: true,
    };
  },
  mounted() {
    this.onResize();
    this.$nextTick(() => {
      window.addEventListener("resize", this.onResize);
    });
  },
  methods: {
    onResize() {
      this.$store.dispatch("getWindowWidth", window.innerWidth);
    },
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.onResize);
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
}

.footer {
  flex: 0 0 auto;
}

@media (max-width: 959.99px) and (-webkit-min-device-pixel-ratio: 2),
  (max-width: 960px) and (min-resolution: 192dpi) {
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

@media (min-width: 959.99px) and (-webkit-min-device-pixel-ratio: 2),
  (min-width: 960px) and (min-resolution: 192dpi) {
  .el-main {
    align-items: center;
    justify-content: center;
  }

  .main-section {
    flex-direction: row;
    max-width: 1280px;
    gap: 40px;
  }

  .footer {
    display: none;
  }

  .result-form {
    flex: 1 1 50%;
  }
}
</style>
