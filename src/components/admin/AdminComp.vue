<template>
  <div style="overflow-y: auto">
    <template v-if="isLoaded">
      <AdminQuickResults />
    </template>
    <template v-if="isLoaded">
      <AdminResultsTable />
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import AdminResultsTable from "./AdminResultTable.vue";
import AdminQuickResults from "./AdminQuickResults.vue";

export default defineComponent({
  name: "AdminComp",
  components: {
    AdminResultsTable,
    AdminQuickResults,
  },
  data() {
    return {
      isLoaded: false,
    };
  },
  async mounted() {
    const isLogged = this.$store.getters.isLogged;
    if (isLogged) {
      await this.$store.dispatch("getAllDocs").then(() => {
        this.isLoaded = true;
      });
    }
  },
});
</script>

<style scoped lang="scss">
</style>
