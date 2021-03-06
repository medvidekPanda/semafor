<template>
  <el-space
    :size="size"
    :direction="windowWidth >= 960 ? 'horizontal' : 'vertical'"
    class="flex-3"
    alignment="flex-start"
    :fill="fill"
  >
    <el-space :size="size" class="buttons">
      <el-button type="primary" @click="aboutTestDialog = true" plain
        >O testu</el-button
      >
      <el-button
        v-if="!isStarted"
        v-on:click="onTestStart()"
        type="success"
        :disabled="isStarted"
        >Spustit test</el-button
      >
      <el-button v-if="isStarted" v-on:click="reloadPage()" type="danger"
        >Resetovat</el-button
      >
    </el-space>
    <section class="semafor-wrapper">
      <div
        class="bg-purple semafor red"
        v-bind:class="{ active: redActive }"
      ></div>
      <div
        class="bg-purple semafor green clickable"
        v-bind:class="{ active: greenActive }"
        @mousedown="onButtonClick()"
      >
        Klikni zde
      </div>
    </section>
    <p class="no-margin no-padding">
      Zbývající počet kliknutí: {{ clicksCount }}
    </p>
  </el-space>

  <el-dialog
    title="Jak test funguje"
    v-model="aboutTestDialog"
    :fullscreen="windowWidth < 600"
  >
    <p>
      Cílem tohoto testu je posoudit reakční čas české a slovenské populace.
      Test spustíte kliknutím na tlačítko <strong>“Spustit test”</strong>. Až
      semafor přeskočí z červené na zelenou, co nejrychleji klikněte na zelený
      semafor, nebo zmáčkněte mezerník.
      <strong>Prosím nekombinujte způsob zadávání.</strong> Test proběhne celkem
      pětkrát v různých časových intervalech. Výsledný reakční čas je průměr
      těchto pěti pokusů.
    </p>
    <p>
      TIP: Hru si nejprve vyzkoušejte na nečisto a až poté proveďte ostrý pokus.
      Test si můžete zopakovat vícekrát. Odesílejte však pouze jednu odpověď na
      osobu.
    </p>
  </el-dialog>

  <el-dialog
    title="Maximální počet kliknutí"
    v-model="maxCountDialog"
    :show-close="showClose"
    :close-on-click-modal="showClose"
    :fullscreen="windowWidth < 600"
  >
    <span
      >Překročen maxímální povolený počet kliknutí. Stránka se načte
      znovu.</span
    >
    <template #footer>
      <span class="dialog-footer">
        <el-button
          type="primary"
          @click="(maxCountDialog = false), reloadPage()"
          >Resetovat</el-button
        >
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { Store } from "vuex";

import { SemaforRound } from "../../types/results/results-round";
import { ResultPost } from "@/types/state/results-post.model";

const fill = true;
const size = 32;
let rounded: string | undefined = undefined;
let roundedCorrected: string | undefined = undefined;
let results: SemaforRound[] = [];
let clicksCount: number;

export default defineComponent({
  name: "SemaforComp",
  computed: {
    windowWidth(): Store<ResultPost> {
      return this.$store.getters.windowWidth;
    },
    isMobile() {
      const isMobile = this.$store.getters.isMobile;
      return isMobile;
    },
  },
  data() {
    return {
      redActive: false,
      greenActive: false,
      minTime: 200,
      maxTime: 800,
      startTime: 0,
      round: 0,
      isStarted: false,
      isFinished: false,
      fill,
      size,
      aboutTestDialog: false,
      clicksCount,
      maxCountDialog: false,
      showClose: false,
    };
  },
  methods: {
    onTestStart() {
      this.isStarted = true;
      this.round = 0;
      results = [];
      this.$store.dispatch("clearStore");
      this.clicksCount = 10;
      this.startTimer();
    },
    startTimer() {
      const timeout =
        Math.random() * (this.maxTime - this.minTime) + this.minTime;
      this.startTime = 0;
      this.round = this.round + 1;
      this.redActive = !this.redActive;

      setTimeout(() => {
        this.redActive = !this.redActive;
        this.greenActive = !this.greenActive;
        this.startTime = Date.now();
      }, timeout);
    },
    onButtonClick() {
      this.checkCounts();
      if (this.greenActive) {
        this.onSaveResult();
      }
    },
    checkCounts() {
      if (this.clicksCount <= 1) {
        this.maxCountDialog = true;
      } else {
        this.clicksCount--;
      }
    },
    onSaveResult() {
      const clickTime = Date.now();
      const result = clickTime - this.startTime;
      let median: string;

      results.push({ value: result, round: this.round });
      rounded = this.calculateRounded().toFixed(2);
      roundedCorrected = this.calculateRoundedCorrected().toFixed(2);
      median = this.calculateMedian();
      this.greenActive = !this.greenActive;
      const payload = {
        results: {
          [this.isMobile ? "mobile" : "desktop"]: {
            rounds: results,
            roundedValue: rounded,
            roundedValueCorrected: roundedCorrected,
            median,
          },
        },
      };
      this.$store.dispatch("saveSemaforResults", payload);

      if (this.round < 5) {
        this.startTimer();
      } else {
        this.isStarted = false;
        this.isFinished = true;
        this.$store.dispatch("saveSemaforResults", { isFinished: true });
      }
    },
    calculateRounded() {
      let number = 0;
      for (const result of results) {
        if (result.value) {
          number = number + result.value;
        }
      }

      return number / results.length;
    },
    calculateRoundedCorrected() {
      function compareNumbers(a: string, b: string) {
        return Number(a) - Number(b);
      }

      const sorted = results
        .map((item: SemaforRound) => String(item.value))
        .sort(compareNumbers);

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const first = sorted.shift();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const last = sorted.pop();

      let number = 0;
      for (const result of sorted) {
        if (result) {
          number = number + Number(result);
        }
      }

      return number / sorted.length;
    },
    calculateMedian(): string {
      const resultsMap = results.map((result) => result.value).sort();
      return String(resultsMap[2]);
    },
    reloadPage() {
      location.reload();
      return false;
    },
  },
  mounted() {
    window.addEventListener("keydown", (e) => {
      if (e.code === "Space") {
        this.checkCounts();
      }

      if (
        e.code === "Space" &&
        this.round > 0 &&
        this.round < 6 &&
        this.greenActive
      ) {
        this.onSaveResult();
      }
    });
  },
});
</script>

<style scoped lang="scss">
.semafor {
  display: flex;
  align-items: center;
  justify-content: center;
  border: var(--el-border-base);
  box-shadow: var(--el-box-shadow-base);
  border-radius: var(--el-border-radius-circle);
  background-color: var(--el-color-info-light);

  &.active {
    &.red {
      background-color: var(--el-color-danger);
    }

    &.green {
      color: var(--el-color-success-lighter);
      background-color: var(--el-color-success);
    }
  }

  &-wrapper {
    display: flex;
    gap: 32px;
  }

  @media (max-width: 959.99px) {
    width: 100px;
    height: 100px;

    &-wrapper {
      flex-direction: row;
      justify-content: center;
    }
  }

  @media (min-width: 960px) {
    width: 150px;
    height: 150px;
    max-width: 200px;
    max-height: 200px;

    &-wrapper {
      flex-direction: column;
      align-items: center;
    }
  }
}

:deep(.el-space.buttons) {
  display: flex;
  justify-content: center;
}

:deep(.el-space__item:last-child) {
  margin-right: 0 !important;
}
</style>
