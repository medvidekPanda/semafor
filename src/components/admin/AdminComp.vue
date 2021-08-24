<template>
  <div>
    <p>Počet záznamů v databázi: {{ totalCount }}</p>
    <p v-for="doc in finalDocs" :key="doc">
      {{ doc }}
    </p>
    <el-button type="primary" plain size="medium" @click="loadResults()" :disabled="finalDocs < 6"
      >Další</el-button
    >
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "AdminComp",
  props: {
    msg: String,
  },
  data() {
    return {
      totalCount: 0,
      finalDocs: "" as any,
    };
  },
  async mounted() {
    this.$store.dispatch("getAllDb");
    this.totalCount = this.$store.getters.numberOfResults;

    this.loadResults();
    // this.$store.dispatch("getDocDb", "2c73fd790b9405a5981c150b69649ecc");
    // console.log("doc", this.$store.getters.dbDocument);
  },
  methods: {
    loadResults() {
      this.$store.dispatch("getDbPagination", { orderBy: "hash", limit: 5 });
      // console.log("docs", this.$store.getters.dbPagination);
      this.$store.dispatch("getDocDb");
      this.finalDocs = this.$store.getters.dbDocument;
      console.log("docs final", this.finalDocs);
    },
  },
});
</script>

<style scoped lang="scss">
</style>
