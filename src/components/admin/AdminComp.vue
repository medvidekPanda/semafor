<template>
  <div style="overflow-y: auto">
    <p>Počet záznamů v databázi: {{ totalCount }}</p>
    <el-table v-if="finalDocs.length > 0" :data="finalDocs" stripe>
      <el-table-column prop="hash" label="Hash" width="280"> </el-table-column>
      <el-table-column prop="age" label="Věk" width="50"> </el-table-column>
      <el-table-column prop="sex" label="Pohlaví" width="80"></el-table-column>
      <el-table-column label="Výsledky" width="180">
        <el-table-column label="Desktop" width="180">
          <el-table-column label="Průměr" width="100"
            ><template #default="scope">
              {{ scope.row.desktop?.roundedValue }} ms
            </template></el-table-column
          >
          <el-table-column label="Kolo 1" width="70"
            ><template #default="scope"
              >{{ scope.row.desktop?.rounds[0].value }} ms</template
            ></el-table-column
          >
          <el-table-column label="Kolo 2" width="70"
            ><template #default="scope"
              >{{ scope.row.desktop?.rounds[1].value }} ms</template
            ></el-table-column
          >
          <el-table-column label="Kolo 3" width="70"
            ><template #default="scope"
              >{{ scope.row.desktop?.rounds[2].value }} ms</template
            ></el-table-column
          >
          <el-table-column label="Kolo 4" width="70"
            ><template #default="scope"
              >{{ scope.row.desktop?.rounds[3].value }} ms</template
            ></el-table-column
          >
          <el-table-column label="Kolo 5" width="70"
            ><template #default="scope"
              >{{ scope.row.desktop?.rounds[4].value }} ms</template
            ></el-table-column
          >
        </el-table-column>
        <el-table-column label="Mobil" width="180">
          <el-table-column label="Průměr" width="100"
            ><template #default="scope"
              >{{ scope.row.mobile?.roundedValue }} ms</template
            ></el-table-column
          >
          <el-table-column label="Kolo 1" width="70"
            ><template #default="scope"
              >{{ scope.row.mobile?.rounds[0].value }} ms</template
            ></el-table-column
          >
          <el-table-column label="Kolo 2" width="70"
            ><template #default="scope"
              >{{ scope.row.mobile?.rounds[1].value }} ms</template
            ></el-table-column
          >
          <el-table-column label="Kolo 3" width="70"
            ><template #default="scope"
              >{{ scope.row.mobile?.rounds[2].value }} ms</template
            ></el-table-column
          >
          <el-table-column label="Kolo 4" width="70"
            ><template #default="scope"
              >{{ scope.row.mobile?.rounds[3].value }} ms</template
            ></el-table-column
          >
          <el-table-column label="Kolo 5" width="70"
            ><template #default="scope"
              >{{ scope.row.mobile?.rounds[4].value }} ms</template
            ></el-table-column
          >
        </el-table-column>
      </el-table-column>
    </el-table>
    <el-pagination
      layout="prev, pager, next"
      :total="lastIndex + 1"
      @current-change="triggerCurrentChange($event)"
    >
    </el-pagination>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { DocumentData } from "@firebase/firestore-types";

const limit = 10;

export default defineComponent({
  name: "AdminComp",
  props: {
    msg: String,
  },
  data() {
    return {
      firstIndex: 0,
      lastIndex: 0,
      limit,
    };
  },
  async mounted() {
    const isLogged = this.$store.getters.isLogged;
    if (isLogged) {
      await this.$store.dispatch("getAllDocs");
      this.lastIndex = this.$store.getters.lastDbIndex;
      this.loadResults();
    }
  },
  computed: {
    totalCount(): number {
      return this.$store.getters.numberOfDocs;
    },
    finalDocs(): DocumentData {
      return this.$store.getters.dbDocPaginated;
    },
  },
  methods: {
    async loadResults() {
      this.$store.commit("selectDocsTest", {
        firstIndex: this.firstIndex,
        limit,
      });
      await this.$store.dispatch("getDocsById");
    },
    triggerCurrentChange(value: number) {
      this.firstIndex = (value - 1) * limit;
      this.loadResults();
    },
  },
});
</script>

<style scoped lang="scss">
</style>
