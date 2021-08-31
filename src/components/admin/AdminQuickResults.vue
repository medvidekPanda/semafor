<template>
  <p>Počet záznamů v databázi: {{ totalCount }}</p>
  <p>
    Průměr nekorigovaný: {{ getAllUncorrected.value }} ms / počet respondentů:
    {{ getAllUncorrected.totalCount }}
  </p>
  <p>
    Průměr desktop nekorigovaný: {{ allDesktop.value }} ms / počet respondentů:
    {{ allDesktop.totalCount }}
  </p>
  <p>
    Průměr mobil nekorigovaný: {{ allMobile.value }} ms / počet respondentů:
    {{ allMobile.totalCount }}
  </p>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "AdminQuickResults",
  data() {
    return {
      isLoaded: false,
    };
  },
  computed: {
    allDesktop(): { value: number; totalCount: number } {
      return this.$store.getters.getAllDesktop;
    },
    getAllUncorrected(): { value: number; totalCount: number } {
      return this.$store.getters.getAllUncorrected;
    },
    totalCount(): number {
      return this.$store.getters.numberOfDocs;
    },
    allMobile(): { value: number; totalCount: number } {
      return this.$store.getters.getAllMobile;
    },
  },
});
</script>

<style scoped lang="scss">
</style>
