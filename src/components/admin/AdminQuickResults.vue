<template>
  <p>Počet záznamů v databázi: {{ totalCount }}</p>
  <el-space wrap size="large">
    <span>
      <h5>Celkem</h5>
      <p>
        průměr: {{ getAllUncorrected.value }} ms / median:
        {{ getAllMedians.value }} ms / počet respondentů:
        {{ getAllUncorrected.totalCount }}
      </p>
    </span>
    <span>
      <h5>Desktop</h5>
      <p>
        průměr: {{ allDesktop.value }} ms / median:
        {{ getAllMediansDesktop.value }} ms / počet respondentů:
        {{ allDesktop.totalCount }}
      </p>
    </span>
    <span>
      <h5>Mobil</h5>
      <p>
        průměr: {{ allMobile.value }} ms / {{ getAllMediansMobile.value }} ms /
        počet respondentů:
        {{ allMobile.totalCount }}
      </p>
    </span>
  </el-space>
</template>

<script lang="ts">
import { ValueTotalCount } from "@/store/results/value-totalCount";
import { defineComponent } from "vue";

export default defineComponent({
  name: "AdminQuickResults",
  data() {
    return {
      isLoaded: false,
    };
  },
  async mounted() {
    const isLogged = this.$store.getters.isLogged;
    if (isLogged) {
      this.loadResults();
    }
  },
  methods: {
    async loadResults() {
      await this.$store.dispatch("getDocsById", {
        commitName: "getAllDesktop",
        query: {
          whatFind: "desktop.roundedValue",
          filterOp: ">",
          value: "0",
        },
      });

      await this.$store.dispatch("getDocsById", {
        commitName: "getAllMobile",
        query: {
          whatFind: "mobile.roundedValue",
          filterOp: ">",
          value: "0",
        },
      });

      await this.$store.dispatch("getDocsById", {
        commitName: "getAllMediansDesktop",
        query: {
          whatFind: "desktop.median",
          filterOp: ">",
          value: "0",
        },
      });

      await this.$store.dispatch("getDocsById", {
        commitName: "getAllMediansMobile",
        query: {
          whatFind: "mobile.median",
          filterOp: ">",
          value: "0",
        },
      });
    },
  },
  computed: {
    allDesktop(): ValueTotalCount {
      return this.$store.getters.getAllDesktop;
    },
    getAllUncorrected(): ValueTotalCount {
      return this.$store.getters.getAllUncorrected;
    },
    totalCount(): number {
      return this.$store.getters.numberOfDocs;
    },
    allMobile(): ValueTotalCount {
      return this.$store.getters.getAllMobile;
    },
    getAllMediansDesktop(): ValueTotalCount {
      return this.$store.getters.getAllMediansDesktop;
    },
    getAllMediansMobile(): ValueTotalCount {
      return this.$store.getters.getAllMediansMobile;
    },
    getAllMedians(): ValueTotalCount {
      return this.$store.getters.getAllMedians;
    },
  },
});
</script>

<style scoped lang="scss">
</style>
