<template>
  <div>
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
import Base64 from "crypto-js/enc-base64";
import CryptoJS from "crypto-js";

import firebase from "firebase";

export default defineComponent({
  name: "NewResultFormComp",
  props: {
    msg: String,
  },
  data() {
    return {
      name: null,
      surName: null,
      age: null,
      email: "",
      hashedData: "",
      errors: [] as string[],
    };
  },
  methods: {
    async onSubmitForm() {
      const db = firebase
        .firestore()
        .collection("results")
        .doc("EtZ2MePgdkZXuGpoT0l9")
        .get();
      await db
        .then((result) => {
          console.log("results", result.data());
        })
        .catch((error) => {
          console.log("error", error);
        });

      // this.errors = [];

      // if (this.name && this.surName && this.age && this.email) {
      //   this.hashData();
      //   return;
      // }

      // this.errors.push("Něco ve formuláři chybí");
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
</style>
