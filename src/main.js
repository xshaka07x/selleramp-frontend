import { createApp } from "vue";
import App from "./App.vue";
import router from "./router.js"; // Vérifie que le fichier existe bien


import "./index.css"; // ✅ Importer Tailwind

const app = createApp(App);
app.use(router);
app.mount("#app");

console.log("Vue App monté !");
