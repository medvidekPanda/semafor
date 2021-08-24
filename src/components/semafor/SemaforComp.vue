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
    <p>Zbývající počet kliknutí: {{ clicksCount }}</p>
    <section class="semafor-wrapper">
      <div
        class="bg-purple semafor red"
        v-bind:class="{ active: redActive }"
      ></div>
      <div
        class="bg-purple semafor green"
        v-bind:class="{ active: greenActive }"
      >
        <p>Klikni na tlačítko</p>
        <el-icon size="32">
          <ArrowDown />
        </el-icon>
      </div>
    </section>
    <el-button
      :disabled="!isStarted"
      @mousedown="onButtonClick()"
      type="danger"
      style="width: 100%"
      >Klikni, když je semafor zelený</el-button
    >
  </el-space>

  <el-dialog
    title="Jak test funguje"
    v-model="aboutTestDialog"
    :fullscreen="windowWidth < 600"
  >
    <p>
      Cílem tohoto testu je posoudit reakční čas české a slovenské populace.
      Test spustíte kliknutím na tlačítko <strong>“Spustit test”</strong>. Až
      semafor přeskočí z červené na zelenou, co nejrychleji klikněte na tlačítko
      “Klikni, když je semafor zelený”, nebo zmáčkněte mezerník.
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
import { Device } from "@capacitor/device";
import { ArrowDown } from "@element-plus/icons";

import SemaforRound from "../../types/results-round";
import ResultPost from "@/types/results-post.model";

const fill = true;
const size = 32;
let rounded: string | undefined = undefined;
let results: SemaforRound[] = [];
let isMobile: boolean;

export default defineComponent({
  name: "SemaforComp",
  async mounted() {
    const info = await Device.getInfo();
    isMobile =
      info.operatingSystem === "ios" || info.operatingSystem === "android";
    this.$store.dispatch("saveSemaforResults", { isMobile });
    window.addEventListener("keydown", (e) => {
      if (
        e.code === "Space" &&
        this.round > 0 &&
        this.round < 6 &&
        this.greenActive
      ) {
        this.checkCounts();
        this.onSaveResult();
      }
    });
  },
  components: {
    ArrowDown,
  },
  computed: {
    windowWidth(): Store<ResultPost> {
      return this.$store.state.windowWidth;
    },
  },
  data() {
    return {
      redActive: false,
      greenActive: false,
      minTime: 2000,
      maxTime: 8000,
      startTime: 0,
      round: 0,
      rounded,
      results,
      isStarted: false,
      fill,
      size,
      aboutTestDialog: false,
      clicksCount: 10,
      maxCountDialog: false,
      showClose: false,
    };
  },
  methods: {
    onTestStart() {
      this.isStarted = true;
      this.round = 0;
      this.results = [];
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

      this.results.push({ value: result, round: this.round });
      this.rounded = this.calculateRounded().toFixed(2);
      this.greenActive = !this.greenActive;

      const payload = {
        results: {
          [isMobile ? "mobile" : "desktop"]: {
            rounds: this.results,
            roundedValue: this.rounded,
          },
        },
      };
      this.$store.dispatch("saveSemaforResults", payload);

      if (this.round < 5) {
        this.startTimer();
      } else {
        this.isStarted = false;
        this.$store.dispatch("saveSemaforResults", { isFinished: true });
      }
    },
    calculateRounded() {
      let number = 0;
      for (const result of this.results) {
        if (result.value) {
          number = number + result.value;
        }
      }

      return number / this.results.length;
    },
    reloadPage() {
      location.reload();
      return false;
    },
  },
});
</script>

<style scoped lang="scss">
.semafor {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: var(--el-color-danger);
  font-weight: 700;
  border: var(--el-border-base);
  box-shadow: var(--el-box-shadow-base);
  border-radius: var(--el-border-radius-circle);
  background-color: var(--el-color-info-light);

  &.active {
    &.red {
      background-color: var(--el-color-danger);
    }

    &.green {
      background-color: var(--el-color-success);
      color: var(--el-color-success-light);
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
