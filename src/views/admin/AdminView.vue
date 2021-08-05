<template>
  <div>Admin</div>
</template>

<script lang="ts">
import { onMounted, defineComponent } from "vue";
import firebase from "firebase/app";
import "firebase/auth";
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
  components: {},
  methods: {},
  data() {
    return {};
  },
});
</script>
