<template>
  <div>
    <button v-on:click="onStartGame()">Start Game</button>
    <div class="semafor red" v-bind:class="{ active: redActive }"></div>
    <div class="semafor green" v-bind:class="{ active: greenActive }"></div>
    <button
      @mousedown="onButtonClick()"
      :disabled="!(round > 0 && round < 6) || !greenActive"
    >
      GO!
    </button>
    <ul>
      <li v-for="result in results" :key="result.value">
        <p v-if="result.round">Round: {{ result.round }}</p>
        <p v-if="result.value">Time: {{ result.value }} ms</p>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Results from "../types/semafor";

export default defineComponent({
  name: "Semafor",
  props: {
    msg: String,
  },
  data() {
    return {
      redActive: false,
      greenActive: false,
      minTime: 2000,
      maxTime: 8000,
      startTime: 0,
      round: 0,
      results: [] as Results[],
    };
  },
  methods: {
    onStartGame() {
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
      this.greenActive = !this.greenActive;

      if (this.round < 5) {
        this.startTimer();
      } else {
        this.calculateFinalRes();
      }
    },
    calculateFinalRes() {
      let number = 0;
      for (const result of this.results) {
        if (result.value) {
          number = number + result.value;
        }
      }

      this.results.push({ value: number / 5, round: "Rounded" });
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
