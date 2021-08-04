<template>
  <div><LoginComp /></div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import LoginComp from "../components/LoginComp.vue";

export default defineComponent({
  name: "Login",
  components: {
    LoginComp,
  },
});
</script>
