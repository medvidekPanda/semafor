<template>
  <LoginComp />
</template>

<script lang="ts">
import { defineComponent } from "vue";

import LoginComp from "../components/common/LoginComp.vue";

export default defineComponent({
  name: "Login",
  components: {
    LoginComp,
  },
});
</script>
