<template>
  <el-space
    :size="size"
    :direction="windowWidth >= 960 ? 'horizontal' : 'vertical'"
    class="flex-50"
    alignment="flex-start"
    :fill="fill"
  >
    <el-space :size="size" class="buttons">
      <el-button type="primary" @click="aboutTestDialog = true" plain
        >O testu</el-button
      >
      <el-button v-on:click="onTestStart()" type="success" :disabled="isStarted"
        >Spustit test</el-button
      >
    </el-space>
    <section class="semafor-wrapper">
      <div
        class="bg-purple semafor red"
        v-bind:class="{ active: redActive }"
      ></div>
      <div
        class="bg-purple semafor green"
        v-bind:class="{ active: greenActive }"
      ></div>
    </section>
    <el-button
      @mousedown="onButtonClick()"
      @click.space="onSpaceSqueeze()"
      :disabled="!(round > 0 && round < 6) || !greenActive"
      type="danger"
      style="width: 100%"
      >Klikni když je semafor zelený</el-button
    >
  </el-space>

  <el-dialog title="Jak hrát" v-model="aboutTestDialog" :fullscreen="windowWidth < 960">
    Hru spustíte kliknutím na tlačítko “Začít hru”. Až semafor přeskočí z
    červené na zelenou, co nejrychleji klikněte na tlačítko “Klikni, když je
    semafor zelený”, nebo zmáčkněte mezerník. Test proběhne celkem pětkrát v
    různých časových intervalech. Výsledný reakční čas je průměr těchto pěti
    pokusů. Průměrný čas vyplňte společně s křestním jménem, demografickými
    údaji a e-mailem do formuláře níže a klikněte na tlačítko odeslat. TIP: Hru
    si nejprve vyzkoušejte na nečisto a až poté proveďte ostrý pokus. Test si
    můžete zopakovat vícekrát. Odesílejte však pouze jednu odpověď na osobu.
  </el-dialog>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { Store } from "vuex";
import { Device } from "@capacitor/device";

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
    window.addEventListener("keydown", e => {
      if (e.code === 'Space' && (this.round > 0 && this.round < 6 && this.greenActive)) {
        this.onSaveResult();
      }
    });
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
    };
  },
  methods: {
    onTestStart() {
      this.isStarted = true;
      this.round = 0;
      this.results = [];
      this.$store.dispatch("clearStore");
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
      this.onSaveResult();
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
  },
});
</script>

<style scoped lang="scss">
.semafor {
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
    }
  }

  &-wrapper {
    display: flex;
    gap: 32px;
  }
}

.semafor {
  @media (max-width: 959.99px) and (-webkit-min-device-pixel-ratio: 2),
    (max-width: 960px) and (min-resolution: 192dpi) {
    width: 100px;
    height: 100px;

    &-wrapper {
      flex-direction: row;
      justify-content: center;
    }
  }

  @media (min-width: 959.99px) and (-webkit-min-device-pixel-ratio: 2),
    (min-width: 960px) and (min-resolution: 192dpi) {
    width: 200px;
    height: 200px;

    &-wrapper {
      flex-direction: column;
      align-items: center;
    }
  }
}

::v-deep {
  .el-space.buttons {
    display: flex;
    justify-content: center;
  }

  .el-space__item:last-child {
    margin-right: 0 !important;
  }
}
</style>
