<template>
  <div class="semafor">
    <SemaforComp />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import SemaforComp from "@/components/SemaforComp.vue"; // @ is an alias to /src

export default defineComponent({
  name: "Semafor",
  components: {
    SemaforComp,
  },
});
</script>
