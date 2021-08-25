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
    <el-button
      type="primary"
      plain
      size="medium"
      @click="loadResults()"
      :disabled="finalDocs < 11"
      >Další</el-button
    >
    <el-button type="primary" plain size="medium" @click="logout()"
      >logout</el-button
    >
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import firebase from "firebase/app";
import "firebase/auth";
import { DocumentData } from "@firebase/firestore-types";

let startAfter: string;

export default defineComponent({
  name: "AdminComp",
  props: {
    msg: String,
  },
  async mounted() {
    const user = firebase.auth().currentUser;
    console.log("user", user);
    if (user) {
      this.$store.dispatch("getAllDocs");
      this.loadResults();
    }
  },
  computed: {
    totalCount(): number {
      return this.$store.getters.numberOfDocs;
    },
    finalDocs(): DocumentData {
      const docs = this.$store.getters.dbDocPaginated;
      console.log("docs", docs);
      startAfter = docs[docs.length - 1]?.hash || "";
      return docs;
    },
  },
  methods: {
    async loadResults() {
      await this.$store.dispatch("getdocsIdsToLoad", {
        orderBy: "hash",
        startAfter,
        limit: 10,
      });
      await this.$store.dispatch("getDocsById");
    },
    logout() {
      firebase.auth().signOut();
    },
  },
});
</script>

<style scoped lang="scss">
</style>
