<template>
  <el-header>
    <el-space wrap size="large" class="header-custom">
      <h6>v1.3.18-{{ environment }}</h6>
      <el-space>
        <el-button
          size="mini"
          icon="el-icon-s-home"
          v-on:click="goToHome()"
        ></el-button>
        <el-button
          size="mini"
          icon="el-icon-setting"
          v-on:click="goToAdmin()"
        ></el-button>
        <el-button
          v-if="isLogged"
          size="mini"
          icon="el-icon-switch-button"
          type="danger"
          v-on:click="logout()"
        ></el-button>
      </el-space>
    </el-space>
  </el-header>
  <router-view />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import firebase from "firebase/app";
import "firebase/auth";

import router from "./router";

export default defineComponent({
  computed: {
    isLogged() {
      return this.$store.getters.isLogged;
    },
  },
  data() {
    return {
      environment: "",
    };
  },
  mounted() {
    this.environment = process.env.NODE_ENV.substring(0, 3);
    document.title = process.env.VUE_APP_TITLE;
  },
  methods: {
    goToAdmin() {
      router.push("admin");
    },
    goToHome() {
      router.push("/");
    },
    logout() {
      firebase.auth().signOut();
      this.$store.commit("isLogged", false);
      router.push("/login");
    },
  },
});
</script>

<style lang="scss">
#app {
  display: flex;
  flex-direction: column;
  flex: 1 1 100%;
  overflow: hidden;
  box-sizing: border-box;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;

  .header-custom {
    display: flex;
    flex: 1 1 100%;
    justify-content: space-between;
  }
}
</style>

<style lang="scss">
@import "../scss/styles";

.el-space__item:last-child {
  margin: 0 !important;
}
</style>
