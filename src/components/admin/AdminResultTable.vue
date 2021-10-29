<template>
  <el-table
    v-if="finalDocs?.length"
    :data="finalDocs"
    :row-class-name="tableRowClassName"
  >
    <el-table-column type="index" :index="indexMethod"></el-table-column>
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
    v-if="finalDocs?.length"
    layout="prev, pager, next"
    :total="lastIndex + 1"
    @current-change="triggerCurrentChange($event)"
  >
  </el-pagination>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { DocumentData } from "@firebase/firestore-types";
import { TableRow } from "@/types/tables/table-row";

const limit = 10;

export default defineComponent({
  name: "AdminResultsTable",
  computed: {
    finalDocs(): DocumentData {
      return this.$store.getters.dbDocPaginated;
    },
  },
  data() {
    return {
      firstIndex: 0,
      lastIndex: 0,
      limit,
    };
  },
  methods: {
    async loadResults() {
      this.$store.commit("setDocsPagination", {
        firstIndex: this.firstIndex,
        limit,
      });
      await this.$store.dispatch("getDocsById", {
        commitName: "getDocsByIdPaginated",
      });
    },
    triggerCurrentChange(value: number) {
      this.firstIndex = (value - 1) * limit;
      this.loadResults();
    },
    indexMethod(index: number) {
      return index + this.firstIndex + 1;
    },
    tableRowClassName({ row }: TableRow) {
      if (row?.desktop?.roundedValue) {
        return "desktop";
      }
      return "";
    },
  },
  async mounted() {
    const isLogged = this.$store.getters.isLogged;
    if (isLogged) {
      this.lastIndex = this.$store.getters.lastDbIndex;
      this.loadResults();
    }
  },
});
</script>

<style scoped lang="scss">
:deep(.el-table__row.desktop) {
  background-color: var(--el-color-success-light);
}
</style>
