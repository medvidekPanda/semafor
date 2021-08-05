<template>
  <div class="semafor">
    <SemaforComp />
    <NewResultFormComp />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import NewResultFormComp from "@/components/semafor/NewResultFormComp.vue"; // @ is an alias to /src
import SemaforComp from "@/components/semafor/SemaforComp.vue"; // @ is an alias to /src

export default defineComponent({
  name: "Semafor",
  components: {
    SemaforComp,
    NewResultFormComp,
  },
});
</script>
