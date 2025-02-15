import { createRouter, createWebHistory } from "vue-router";
import ProductDetails from "./components/ProductDetails.vue";
import ProductSearch from "./components/ProductSearch.vue";
import ProductList from "./components/ProductList.vue"; // ✅ Liste des produits

const routes = [
  { path: "/", component: ProductSearch }, // ✅ Rechercher un produit
  { path: "/products", component: ProductList }, // ✅ Voir tous les produits
  { path: "/product/:barcode", component: ProductDetails } // ✅ Détails d'un produit
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
