import { createApp } from "vue";
import App from "./App.vue";
import router from "./router"; // ✅ Importer Vue Router

import "./index.css"; // ✅ Importer Tailwind

const app = createApp(App);
app.use(router);
app.mount("#app");

console.log("Vue App monté !");
