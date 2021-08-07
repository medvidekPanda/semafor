<template>
  <div>
    <form id="dataForm">
      <div>
        <label for="name">Křestní jméno</label>
        <input id="name" v-model="formData.name" type="text" name="name" />
        <p v-if="errors[1]">{{ errors[1] }}</p>
      </div>
      <div>
        <label for="age">Věk</label>
        <input id="age" v-model="formData.age" type="number" name="age" />
        <p v-if="errors[0]">{{ errors[0] }}</p>
      </div>
      <div>
        <label for="sex">Pohlaví</label>
        <section id="sex">
          <input type="radio" v-model="formData.sex" value="male" />Muž
          <input type="radio" v-model="formData.sex" value="female" />Žena
          <input type="radio" v-model="formData.sex" value="other" />Ostatní
        </section>
        <p v-if="errors[2]">{{ errors[2] }}</p>
      </div>
      <div>
        <label for="email">E-mail</label>
        <input id="email" v-model="formData.email" type="email" name="email" />
        <p v-if="errors[3]">{{ errors[3] }}</p>
      </div>
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
import PostForm from "../../types/post-form";

let formData: ResultsForm = {
  age: "",
  email: "",
  name: "",
  sex: "",
};

export default defineComponent({
  name: "NewResultFormComp",
  data() {
    return {
      formData,
      errors: [] as string[],
    };
  },
  methods: {
    onSubmitForm() {
      this.errors = [];

      Number(this.formData.age) < 6
        ? (this.errors[0] = "Minimální věk 6 let!")
        : this.errors.slice(0, 0);

      Number(this.formData.age) > 100
        ? (this.errors[0] = "Maximální věk 99 let!")
        : this.errors.slice(0, 0);

      this.formData.name
        ? this.errors.slice(0, 1)
        : (this.errors[1] = "Jméno je povinné!");
      this.formData.sex
        ? this.errors.slice(0, 2)
        : (this.errors[2] = "Pohlaví je povinné!");
      this.formData.email
        ? this.errors.slice(0, 3)
        : (this.errors[3] = "Email je povinný!");

      console.log(this.errors);

      if (this.errors.length === 0) {
        this.submitData();
      }
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
    async submitData() {
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
    },
  },
});
</script>

<style scoped lang="scss"></style>
