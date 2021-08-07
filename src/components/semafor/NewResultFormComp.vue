<template>
  <el-form ref="form" :model="form" label-width="120px">
    <el-form-item label="Křestní jméno">
      <el-input v-model="formData.name"></el-input>
      <p v-if="errors[1]">{{ errors[1] }}</p>
    </el-form-item>
    <el-form-item label="Věk">
      <el-input-number
        v-model="formData.age"
        :min="6"
        :max="99"
      ></el-input-number>
      <p v-if="errors[0]">{{ errors[0] }}</p>
    </el-form-item>
    <el-form-item label="Pohlaví">
      <el-radio v-model="formData.sex" label="man">Muž</el-radio>
      <el-radio v-model="formData.sex" label="woman">Žena</el-radio>
      <el-radio v-model="formData.sex" label="other">Ostatní</el-radio>
      <p v-if="errors[2]">{{ errors[2] }}</p>
    </el-form-item>
    <el-form-item label="E-mail">
      <el-input v-model="formData.email" type="email"></el-input>
      <p v-if="errors[3]">{{ errors[3] }}</p>
    </el-form-item>
    <el-button type="primary" size="medium" @click="onSubmitForm()"
      >Odeslat výsledky</el-button
    >
  </el-form>
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

<style scoped lang="scss">
.el-form-item {
  flex-direction: column;
}

.el-form-item__label {
  text-align: left;
  line-height: 24px;
}
</style>
