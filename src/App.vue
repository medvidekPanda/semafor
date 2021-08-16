<template>
  <el-header>
    <el-space wrap size="large">
      <el-link :underline="false">
        <router-link to="/">Test postřehu</router-link>
      </el-link>
      <el-link :underline="false">
        <router-link to="/admin">Administrace</router-link>
      </el-link>
      <p>v0.9b</p>
    </el-space>
  </el-header>
  <router-view />
</template>

<style lang="scss">
#app {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  box-sizing: border-box;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>

<style lang="scss">
@import "../scss/styles";
</style>
