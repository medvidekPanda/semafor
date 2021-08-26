<template>
  <el-form
    ref="formData"
    :model="formData"
    label-width="180px"
    label-position="left"
    style="max-width: 200px"
    class="align--self-center margin-top-5"
  >
    <el-form-item label="Přihlašovací jméno">
      <el-input v-model="formData.email"></el-input>
    </el-form-item>
    <el-form-item label="Heslo">
      <el-input v-model="formData.password" type="password"></el-input>
    </el-form-item>
    <el-button type="primary" plain size="medium" @click="signIn()"
      >Přihlásit</el-button
    >
  </el-form>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import firebase from "firebase/app";
import "firebase/auth";
import router from "../../router";

let formData = {
  email: "",
  password: "",
};

export default defineComponent({
  name: "LoginComp",
  props: {
    msg: String,
  },
  data() {
    return {
      formData,
    };
  },
  methods: {
    signIn() {
      firebase
        .auth()
        .signInWithEmailAndPassword(formData.email, formData.password)
        .then(() => {
          console.log("Přihlášení úspěšné");
          this.$store.commit("isLogged", true);
          router.replace("/admin");
        })
        .catch((error) => {
          console.log("err", error.code);
        });
    },
    logout() {
      firebase
        .auth()
        .signOut()
        .then(() => {
          console.log("Odhlášení úspěšné");
          router.replace("/admin");
        })
        .catch((error) => {
          console.log("err", error.code);
        });
    },
  },
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>
