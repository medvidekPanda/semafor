<template>
  <div>
    <p>Počet záznamů v databázi: {{ totalCount }}</p>
    <p v-for="doc in finalDocs" :key="doc">
      {{ doc.id }}
    </p>
    <el-button type="primary" plain size="medium" @click="loadResults()"
      >Další</el-button
    >
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";

import { FirebaseDocs } from "../../config/firebase";

export default defineComponent({
  name: "AdminComp",
  props: {
    msg: String,
  },
  data() {
    return {
      totalCount: 0,
      lastDoc: "" as any,
      finalDocs: "" as any,
    };
  },
  async mounted() {
    await firebase
      .firestore()
      .collection(FirebaseDocs.firebaseDocName)
      .get()
      .then((res) => (this.totalCount = res.size));

    this.loadResults();
  },
  methods: {
    async loadResults() {
      await firebase
        .firestore()
        .collection(FirebaseDocs.firebaseDocName)
        .orderBy("hash")
        .startAfter(this.lastDoc)
        .limit(3)
        .get()
        .then((result) => {
          this.lastDoc = result.docs[result.docs.length - 1];
          this.finalDocs = result.docs;
          console.log("test 2", result);
        });
    },
  },
});
</script>

<style scoped lang="scss">
</style>
