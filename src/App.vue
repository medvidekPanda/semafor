<template>
  <el-header>
    <el-space wrap size="large" class="header-custom">
      <h6>v1.1.0-dev</h6>
      <el-space>
        <el-button size="mini" icon="el-icon-s-home" v-on:click="goToHome()"></el-button>
        <el-button size="mini" icon="el-icon-setting" v-on:click="goToAdmin()"></el-button>
      </el-space>
    </el-space>
  </el-header>
  <router-view />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import router from "./router";

export default defineComponent({
  mounted() {
    document.title = process.env.VUE_APP_TITLE;
  },
  methods: {
    goToAdmin() {
      router.push('admin')
    },
    goToHome() {
      router.push('/')
    }
  }
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
