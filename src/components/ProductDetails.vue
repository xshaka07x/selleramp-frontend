<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const product = ref(null);
const error = ref("");

const fetchProduct = async () => {
  const barcode = route.params.barcode;
  try {
    const response = await fetch(`https://web-production-3ecbb.up.railway.app/product/${barcode}`);
    if (!response.ok) throw new Error("Produit non trouvé");
    product.value = await response.json();
  } catch (err) {
    error.value = err.message;
  }
};

onMounted(fetchProduct);
</script>

<template>
  <div class="max-w-3xl mx-auto mt-6 p-6 bg-white shadow-md rounded-lg border">
    <h2 class="text-2xl font-bold mb-4 text-gray-800">🔍 Détails du produit</h2>

    <div v-if="error" class="text-red-500 font-semibold">{{ error }}</div>

    <div v-else-if="product" class="grid grid-cols-2 gap-4 text-gray-700">
      <div><strong>📦 Nom :</strong> {{ product.name }}</div>
      <div><strong>🆔 Code-barres :</strong> {{ product.barcode }}</div>
      <div><strong>🔗 ASIN :</strong> {{ product.asin }}</div>
      <div><strong>📂 Catégorie :</strong> {{ product.category }}</div>
      <div><strong>💰 Prix d'achat :</strong> {{ product.purchase_price }} €</div>
      <div><strong>🛒 Prix Amazon :</strong> {{ product.amazon_price }} €</div>
      <div><strong>🚚 Frais FBA :</strong> {{ product.fba_fees }} €</div>
      <div><strong>📊 ROI :</strong> {{ product.roi }} %</div>
      <div><strong>📈 Classement des ventes :</strong> {{ product.sales_rank }}</div>
      <div><strong>🏬 Lieu d'achat :</strong> {{ product.purchase_location }}</div>
      <div><strong>📅 Date d'achat :</strong> {{ product.purchase_date }}</div>
    </div>

    <div class="mt-6 text-center">
      <router-link to="/"
        class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
        ⬅️ Retour
      </router-link>
    </div>
  </div>
</template>
