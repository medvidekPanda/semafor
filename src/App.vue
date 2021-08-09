<template>
  <el-header>
    <el-space wrap size="large">
      <el-link :underline="false">
        <router-link to="/">Test postřehu</router-link>
      </el-link>
      <el-link :underline="false">
        <router-link to="/admin">Administrace</router-link>
      </el-link>
    </el-space>
  </el-header>
  <router-view />
</template>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
