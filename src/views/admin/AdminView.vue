<template>
  <AdminComp />
</template>

<script lang="ts">
import { onMounted, defineComponent } from "vue";
import firebase from "firebase/app";
import "firebase/auth";

import AdminComp from "@/components/admin/AdminComp.vue";
import router from "../../router";

export default defineComponent({
  name: "Admin",
  setup() {
    onMounted(() => {
      const user = firebase.auth().currentUser;
      if (!user) {
        alert("Pro vstup do administrace je nutné přihlášení");
        router.replace("/login");
      }
    });
  },
  components: {
    AdminComp
  },
  methods: {},
  data() {
    return {};
  },
});
</script>
