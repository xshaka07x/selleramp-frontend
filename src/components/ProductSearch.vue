<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import Quagga from "quagga";

const router = useRouter();
const barcode = ref("");
const scanning = ref(false);
const scanError = ref(""); // 🔴 Gestion des erreurs

// 📌 Vérifier que la page est servie en HTTPS
const checkHTTPS = () => {
  if (window.location.protocol !== "https:") {
    scanError.value = "⚠️ L'accès à la caméra nécessite HTTPS.";
    console.error("❌ Scanner bloqué : Page non sécurisée (HTTPS requis)");
    return false;
  }
  return true;
};

// 📷 **Démarrer le scanner**
const startScanner = () => {
  if (!checkHTTPS()) return; // 🔴 Bloquer si HTTPS manquant

  scanning.value = true;
  scanError.value = ""; // Réinitialiser l'erreur

  console.log("📸 Démarrage du scanner...");

  Quagga.init(
    {
      inputStream: {
        type: "LiveStream",
        constraints: {
          facingMode: { ideal: "environment" }, // 📷 **Forcer caméra arrière**
        },
        target: "#scanner-container", // ✅ Fix bug affichage
      },
      locator: { patchSize: "medium", halfSample: true },
      numOfWorkers: 2, // 📌 Optimisation pour mobile
      decoder: { readers: ["ean_reader"] }, // 📖 Lecture EAN
      locate: true,
    },
    (err) => {
      if (err) {
        console.error("❌ Erreur scanner:", err);
        scanError.value = "⚠️ Impossible d'initialiser la caméra.";
        scanning.value = false;
        return;
      }
      console.log("✅ Scanner prêt !");
      Quagga.start();
    }
  );

  Quagga.onDetected((result) => {
    console.log("✅ Code-barres détecté:", result.codeResult.code);
    barcode.value = result.codeResult.code;
    stopScanner(); // **Arrêter proprement**
    searchProduct(); // **Rechercher automatiquement**
  });
};

// 📌 **Rechercher un produit**
const searchProduct = async () => {
  if (!barcode.value) return;

  try {
    const response = await fetch(`https://web-production-3ecbb.up.railway.app/product/${barcode.value}`);

    if (response.status === 404) {
      const newProduct = {
        barcode: barcode.value,
        asin: "UNKNOWN",
        name: "Produit scanné",
        category: "Non classé",
        purchase_price: 0,
        amazon_price: 0,
        fba_fees: 0,
        roi: 0,
        sales_rank: 0,
        purchase_location: "Scan direct",
        purchase_date: new Date().toISOString().split("T")[0], 
      };

      await fetch("https://web-production-3ecbb.up.railway.app/add_product", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProduct),
      });

      alert("✅ Produit ajouté !");
    }

    router.push(`/product/${barcode.value}`);
  } catch (error) {
    console.error("Erreur API:", error);
    scanError.value = "⚠️ Erreur lors de la récupération du produit.";
  }
};

// 🛑 **Arrêter proprement le scanner**
const stopScanner = () => {
  if (scanning.value) {
    console.log("🛑 Arrêt du scanner...");
    Quagga.stop();
    scanning.value = false;
  }
};

// 🛑 **Arrêter le scanner en quittant la page**
onUnmounted(() => {
  stopScanner();
});
</script>

<template>
  <div class="flex flex-col items-center gap-4">
    <h2 class="text-xl font-semibold">🔍 Rechercher un produit</h2>

    <!-- 🔹 Recherche manuelle -->
    <input
      v-model="barcode"
      type="text"
      placeholder="Saisir un code-barres..."
      class="border p-2 rounded w-64 text-center"
    />
    <button @click="searchProduct" class="bg-blue-500 text-white px-4 py-2 rounded">
      Rechercher
    </button>

    <!-- 🔹 Scanner -->
    <button @click="startScanner" class="bg-green-500 text-white px-4 py-2 rounded">
      📷 Scanner un produit
    </button>

    <!-- 🔴 Message d'erreur -->
    <p v-if="scanError" class="text-red-500 mt-2">{{ scanError }}</p>

    <!-- 📷 Zone du scanner -->
    <div v-if="scanning" class="mt-4 border p-2 bg-gray-100 w-full flex flex-col items-center">
      <p class="text-sm">📸 Scanner en cours... Pointez un code-barres</p>
      <div id="scanner-container" class="w-full h-64"></div>
      <button @click="stopScanner" class="bg-red-500 text-white px-4 py-2 rounded mt-2">
        ❌ Arrêter le scan
      </button>
    </div>
  </div>
</template>
