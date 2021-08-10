<template>
  <el-space wrap :size="size" direction="vertical" alignment="start">
    <el-form
      ref="formData"
      :model="formData"
      label-width="120px"
      label-position="left"
    >
      <el-form-item label="Křestní jméno">
        <el-input v-model="formData.name"></el-input>
        <p v-if="errors[1]">{{ errors[1] }}</p>
      </el-form-item>
      <el-row :gutter="16" justify="center">
        <el-col :span="9">
          <el-form-item label="Věk">
            <el-input-number
              v-model="formData.age"
              :min="6"
              :max="99"
            ></el-input-number>
            <p v-if="errors[0]">{{ errors[0] }}</p>
          </el-form-item>
        </el-col>
        <el-col :span="15">
          <el-form-item label="Pohlaví">
            <el-cascader
              v-model="formData.sex"
              :options="dropDownSex"
              placeholder="Vyber..."
            ></el-cascader>
            <p v-if="errors[2]">{{ errors[2] }}</p>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="E-mail">
        <el-input v-model="formData.email" type="email"></el-input>
        <p v-if="errors[3]">{{ errors[3] }}</p>
      </el-form-item>
      <el-button type="primary" plain size="medium" @click="onSubmitForm()"
        >Odeslat výsledky</el-button
      >
    </el-form>
    <p>
      Cílem této hry je posoudit reakční čas české populace. Vyplněním a
      odeslání formuláře dáváte souhlas se zpracováním demografických údajů (věk
      a pohlaví) k výzkumným účelům. Formulář nesbírá osobní údaje. Vyplnění
      křestního jména a e-mailu slouží pouze pro hashovací funkci (více zde) a
      vytvoření identifikačního kódu v databázi. Účelem vytvoření tohoto kódu je
      zabránit duplikaci odeslaných odpovědí. Celá hra je tak anonymní.
    </p>
  </el-space>
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
      dropDownSex: [
        {
          value: "male",
          label: "Muž",
        },
        {
          value: "female",
          label: "Žena",
        },
        {
          value: "other",
          label: "Ostatní",
        },
      ],
      size: 24,
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
::v-deep {
  .el-form-item {
    flex-direction: column;
  }

  .el-form-item__label {
    line-height: 24px;
  }

  .el-input-number {
    min-width: 128px;
  }

  .el-cascader,
  .el-input-number {
    width: 100%;
  }
}
</style>
