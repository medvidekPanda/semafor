<template>
  <div>
    <el-button
      v-on:click="onStartGame()"
      :disabled="isStarted"
      >Začít hru</el-button
    >
    <div class="semafor red" v-bind:class="{ active: redActive }"></div>
    <div class="semafor green" v-bind:class="{ active: greenActive }"></div>
    <el-button
      @mousedown="onButtonClick()"
      :disabled="!(round > 0 && round < 6) || !greenActive"
      >Klikni když je semafor zelený</el-button
    >
    <div v-if="rounded">Průměrný čas: {{ rounded }}ms</div>
    <ul>
      <li v-for="result in results" :key="result.value">
        <p v-if="result.round">Kolo: {{ result.round }}</p>
        <p v-if="result.value">Čas: {{ result.value }} ms</p>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import SemaforRound from "../../types/results-round";

let rounded: string | undefined = undefined;
let results: SemaforRound[] = [];

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

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.semafor {
  width: 100px;
  height: 100px;
  border: 2px solid black;
  border-radius: 50%;

  &.active {
    &.red {
      background-color: red;
    }

    &.green {
      background-color: green;
    }
  }
}
</style>
