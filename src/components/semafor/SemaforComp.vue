<template>
  <el-space wrap :size="size" direction="vertical" :fill="fill">
    <el-space :size="size" class="buttons">
      <el-button type="primary" @click="howToPlayDialog = true" plain>Jak hrát</el-button>
      <el-button v-on:click="onStartGame()" type="success" :disabled="isStarted">Začít hru</el-button>
    </el-space>
    <el-row :gutter="16" justify="center">
      <el-col :span="12" justify="center" class="center">
        <div
          class="grid-content bg-purple semafor red"
          v-bind:class="{ active: redActive }"
        ></div>
      </el-col>
      <el-col :span="12" class="center">
        <div
          class="grid-content bg-purple semafor green"
          v-bind:class="{ active: greenActive }"
        ></div
      ></el-col>
    </el-row>
    <el-button
      @mousedown="onButtonClick()"
      :disabled="!(round > 0 && round < 6) || !greenActive"
      type="danger"
      style="width: 100%"
      >Klikni když je semafor zelený</el-button
    >
  </el-space>

  <el-dialog title="Jak hrát" v-model="howToPlayDialog" fullscreen="true">
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
import SemaforRound from "../../types/results-round";

let rounded: string | undefined = undefined;
let results: SemaforRound[] = [];
const fill = true;
const size = 32;

export default defineComponent({
  name: "SemaforComp",
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
      howToPlayDialog: false,
    };
  },
  methods: {
    onStartGame() {
      this.isStarted = true;
      this.round = 0;
      this.results = [];
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
      const clickTime = Date.now();
      const result = clickTime - this.startTime;

      this.results.push({ value: result, round: this.round });
      this.rounded = this.calculateRounded().toFixed(2);
      this.greenActive = !this.greenActive;

      const payload = {
        results: { rounds: this.results, roundedValue: this.rounded },
      };
      this.$store.dispatch("saveSemaforResults", payload);

      if (this.round < 5) {
        this.startTimer();
      } else {
        this.isStarted = false;
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
  width: 100px;
  height: 100px;
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
