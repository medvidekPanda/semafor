<template>
  <div>
    <form id="dataForm">
      <div v-if="errors.length">
        <ul>
          <li v-for="error in errors" :key="error">{{ error }}</li>
        </ul>
      </div>
      <label for="name">Křestní jméno</label>
      <input id="name" v-model="formData.name" type="text" name="name" />
      <label for="age">Věk</label>
      <input id="age" v-model="formData.age" type="number" name="age" />
      <section>
        <input type="radio" v-model="formData.sex" value="male" />Muž
        <input type="radio" v-model="formData.sex" value="female" />Žena
        <input type="radio" v-model="formData.sex" value="other" />Ostatní
      </section>
      <label for="email">E-mail</label>
      <input id="email" v-model="formData.email" type="email" name="email" />
      <button type="button" value="Submit" @click="onSubmitForm()">
        Odeslat
      </button>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import MD5 from "crypto-js/md5";
import CryptoJS from "crypto-js";

import ResultsForm from "../../types/results-form";
import PostForm from "../..//types/post-form";

let formData: ResultsForm = {
  age: "",
  email: "",
  name: "",
  sex: "",
};

export default defineComponent({
  name: "NewResultFormComp",
  props: {
    msg: String,
  },
  data() {
    return {
      formData,
      errors: [] as string[],
    };
  },
  methods: {
    async onSubmitForm() {
      this.errors = [];

      if (Number(this.formData.age) > 0 && this.formData.email) {
        const results: PostForm = {
          age: this.formData.age,
          sex: this.formData.sex,
        };

        await this.$store.dispatch("saveSemaforResults", {
          id: this.hashData(),
          results,
        });

        await this.$store
          .dispatch("postResults")
          .then(() => {
            alert("Záznam uložen v pořádku");
          })
          .catch((error) => {
            alert(error);
          });

        return;
      }

      this.errors.push("Něco ve formuláři chybí");
    },
    hashData() {
      const hash = CryptoJS.HmacSHA512(
        `${
          this.formData.age
        }+${this.formData.name.toLowerCase()}+${this.formData.email.toLowerCase()}`,
        this.formData.email.toLowerCase()
      );
      return MD5(hash).toString();
    },
  },
});
</script>

<style scoped lang="scss"></style>
