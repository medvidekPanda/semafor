import { createApp } from "vue";
import { store, key } from "./store/store";

import App from "./App.vue";
import firebase from "firebase/app";
import router from "./router";
import ElementPlus from 'element-plus';
import 'element-plus/lib/theme-chalk/index.css';

const firebaseConfig = {
  apiKey: "AIzaSyBioJiU3hh11shAXTq178UMICFru6VsifI",
  authDomain: "semafor-23f77.firebaseapp.com",
  projectId: "semafor-23f77",
  storageBucket: "semafor-23f77.appspot.com",
  messagingSenderId: "228547972371",
  appId: "1:228547972371:web:b9354a2b7a50e23a4ddee6"
};

firebase.initializeApp(firebaseConfig);

createApp(App).use(router).use(store, key).use(ElementPlus).mount("#app");
