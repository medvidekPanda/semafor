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
    <form id="dataForm">
      <p v-if="errors.length">
        <ul>
          <li v-for="error in errors" :key="error">{{ error }}</li>
        </ul>
      </p>
      <label for="name">Jméno</label>
      <input id="name" v-model="name" type="text" name="name" />
      <label for="name">Příjmení</label>
      <input id="surName" v-model="surName" type="text" name="surName" />
      <label for="name">Věk</label>
      <input id="age" v-model="age" type="text" name="age" />
      <label for="name">E-mail</label>
      <input id="email" v-model="email" type="text" name="email" />
      <button type="button" value="Submit" @click="onSubmitForm()">
        Odeslat
      </button>
      <h3 v-if="hashedData">Zakódovaná data: {{ hashedData }}</h3>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Results from "../types/semafor";
import Base64 from "crypto-js/enc-base64";
import CryptoJS from "crypto-js";

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
      name: null,
      surName: null,
      age: null,
      email: "",
      hashedData: "",
      errors: [] as string[],
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
    onSubmitForm() {
      this.errors = [];

      if (this.name && this.surName && this.age && this.email) {
        this.hashData();
        return;
      }

      this.errors.push("Něco ve formuláři chybí");
    },
    hashData() {
      const hash = CryptoJS.HmacSHA512(
        `${this.name}+${this.surName}+${this.age}+${this.email}`,
        this.email
      );

      this.hashedData = String(hash);
      console.log("hash", Base64.stringify(hash));
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
