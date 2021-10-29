<template>
  <div style="overflow-y: auto">
    <template v-if="isLoaded">
      <el-button type="danger" plain size="medium" @click="triggerSetMedians()"
        >Vytvoř median</el-button
      >
      <el-button
        type="danger"
        plain
        size="medium"
        @click="triggerCorrectedRounded()"
        >Vytvoř korigovaný průměr</el-button
      >
      <el-button type="primary" plain size="medium" @click="triggerExportData()"
        >Export</el-button
      >
      <AdminQuickResults />
    </template>
    <template v-if="isLoaded">
      <AdminResultsTable />
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { DocumentData } from "@firebase/firestore-types";

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
  methods: {
    triggerSetMedians() {
      this.$store.dispatch("addMedian");
    },
    triggerCorrectedRounded() {
      this.$store.dispatch("addCorrectedRounded");
    },
    async triggerExportData() {
      this.$store.commit("clearDocArray");
      await this.$store.getters.getAllDocsId.forEach(
        (element: DocumentData) => {
          this.$store.dispatch("getDocsById", {
            commitName: "generateExport",
            docId: [element.id],
          });
        }
      );

      const array: DocumentData[] = this.$store.getters.getDocArray;

      setTimeout(() => {
        const data = JSON.stringify(array);
        const blob = new Blob([data], { type: "text/plain" });
        const e = document.createEvent("MouseEvents"),
          a = document.createElement("a");
        a.download = `semafor-${new Date().toISOString()}.json`;
        a.href = window.URL.createObjectURL(blob);
        a.dataset.downloadurl = ["text/json", a.download, a.href].join(":");
        e.initEvent("click", true, false);
        a.dispatchEvent(e);
      }, 1000);
    },
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
