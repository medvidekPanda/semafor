import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyBioJiU3hh11shAXTq178UMICFru6VsifI",
  authDomain: "semafor-23f77.firebaseapp.com",
  projectId: "semafor-23f77",
  storageBucket: "semafor-23f77.appspot.com",
  messagingSenderId: "228547972371",
  appId: "1:228547972371:web:b9354a2b7a50e23a4ddee6"
};

firebase.initializeApp(firebaseConfig);

createApp(App).use(router).mount("#app");
