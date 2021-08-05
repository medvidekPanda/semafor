<template>
  <h1>Přihlášení k účtu</h1>
  <p><input type="text" placeholder="Email" v-model="email" /></p>
  <p><input type="password" placeholder="Heslo" v-model="password" /></p>
  <p><button @click="signIn()">Přihlásit</button></p>
  <p><button @click="logout()">Odhlásit</button></p>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import firebase from "firebase/app";
import "firebase/auth";
import router from "../../router";

const email = ref("");
const password = ref("");

export default defineComponent({
  name: "LoginComp",
  props: {
    msg: String,
  },
  data() {
    return {
      email,
      password,
    };
  },
  methods: {
    signIn() {
      firebase
        .auth()
        .signInWithEmailAndPassword(email.value, password.value)
        .then(() => {
          console.log("Přihlášení úspěšné");
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
