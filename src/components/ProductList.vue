<script setup>
import { ref, onMounted } from "vue";

const products = ref([]);
const error = ref("");

const fetchProducts = async () => {
  try {
    const response = await fetch("https://web-production-3ecbb.up.railway.app/products");
    if (!response.ok) throw new Error("Impossible de récupérer les produits");
    products.value = await response.json();
  } catch (err) {
    error.value = err.message;
  }
};

onMounted(fetchProducts);
</script>

<template>
  <div class="max-w-4xl mx-auto mt-6 p-6 bg-white shadow-md rounded-lg border">
    <h2 class="text-2xl font-bold mb-4 text-gray-800">📦 Produits enregistrés</h2>

    <div v-if="error" class="text-red-500 font-semibold">{{ error }}</div>

    <div v-else>
      <div v-if="products.length === 0" class="text-gray-500 text-center">Aucun produit enregistré.</div>

      <table v-else class="w-full border-collapse border border-gray-200">
        <thead>
          <tr class="bg-gray-100">
            <th class="border p-2">Nom</th>
            <th class="border p-2">Code-barres</th>
            <th class="border p-2">Prix</th>
            <th class="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="product in products" :key="product.id" class="hover:bg-gray-50">
            <td class="border p-2">{{ product.name }}</td>
            <td class="border p-2">{{ product.barcode }}</td>
            <td class="border p-2">{{ product.amazon_price }} €</td>
            <td class="border p-2 text-center">
              <router-link :to="'/product/' + product.barcode"
                class="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600">
                🔎 Voir
              </router-link>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
