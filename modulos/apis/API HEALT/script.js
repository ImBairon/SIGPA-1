// script.js - Versión con conexión real a crop.health + traducción de resultados

const inputFile = document.getElementById("imageInput");
const analyzeBtn = document.getElementById("analyzeBtn");
const previewDiv = document.getElementById("preview");
const imgPreview = document.getElementById("imgPreview");
const resultsSection = document.getElementById("results");
const diagnosisContainer = document.getElementById("diagnosisContainer");
const rawJsonPre = document.getElementById("rawJson");
const errorBox = document.getElementById("errorBox");
const errorMessage = document.getElementById("errorMessage");

// ⚠️ Reemplaza por tu API Key
const API_KEY = "lTXLKqpwyhsj0TgD6Hru40yEhK4qaP9NNITTIMM7tYJFI8SeLv";
const API_URL = "https://crop.kindwise.com/api/v1/identification";

// Diccionario de traducciones
const TRANSLATIONS = {
  // Cultivos
  "onion": "Cebolla",
  "potato": "Papa",
  "tomato": "Tomate",
  "maize": "Maíz",
  "corn": "Maíz",
  "wheat": "Trigo",
  "rice": "Arroz",

  // Enfermedades comunes
  "Alternaria brown spot": "Mancha marrón por Alternaria",
  "apple scab": "Sarna del manzano",
  "late blight": "Tizón tardío",
  "early blight": "Tizón temprano",
  "Iris yellow spot virus": "Virus de la mancha amarilla del iris"
};

// Función para traducir nombres
function translateTerm(term) {
  if (!term) return term;
  return TRANSLATIONS[term.trim()] || term;
}

// Convertir archivo a Base64
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Error leyendo imagen"));
    reader.onload = () => resolve(reader.result);
    reader.readAsDataURL(file);
  });
}

// Vista previa al seleccionar archivo
inputFile.addEventListener("change", async () => {
  resetUI();
  const file = inputFile.files[0];
  if (!file || !file.type.startsWith("image/")) {
    showError("Selecciona una imagen válida");
    return;
  }
  try {
    const dataUrl = await fileToBase64(file);
    imgPreview.src = dataUrl;
    previewDiv.classList.remove("hidden");
  } catch {
    showError("Error al leer imagen");
  }
});

// Botón "Analizar mi planta"
analyzeBtn.addEventListener("click", async () => {
  resetUI();
  const file = inputFile.files[0];
  if (!file || !file.type.startsWith("image/")) {
    showError("Selecciona una imagen válida");
    return;
  }

  try {
    const dataUrl = await fileToBase64(file);
    diagnosisContainer.innerHTML = "<p>⏳ Analizando con crop.health…</p>";
    resultsSection.classList.remove("hidden");

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Api-Key": API_KEY
      },
      body: JSON.stringify({
        images: [dataUrl.split(",")[1]]
      })
    });

    if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);

    const data = await response.json();
    rawJsonPre.textContent = JSON.stringify(data, null, 2);
    displayResults(data);

  } catch (err) {
    showError("Error conectando con API: " + err.message);
  }
});

// Mostrar resultados en pantalla con traducción
function displayResults(data) {
  diagnosisContainer.innerHTML = "";
  const res = data.result;
  if (!res) {
    diagnosisContainer.textContent = "Sin datos en respuesta";
    return;
  }

  // Cultivo detectado
  if (res.crop?.suggestions?.length) {
    const topCrop = res.crop.suggestions[0];
    const translatedCrop = translateTerm(topCrop.name);
    const p = document.createElement("p");
    p.innerHTML = `Cultivo más probable: <strong>${translatedCrop}</strong> (${(topCrop.probability*100).toFixed(1)} %)`;
    diagnosisContainer.appendChild(p);
  }

  // Enfermedades detectadas
  if (res.disease?.suggestions?.length) {
    res.disease.suggestions.forEach(d => {
      const card = document.createElement("div");
      card.className = "card";
      const prob = (d.probability * 100).toFixed(1);
      const translatedName = translateTerm(d.name);
      card.innerHTML = `<h4>${translatedName} — ${prob}%</h4>
        ${d.details?.description ? `<p>${d.details.description}</p>` : ""}
        ${d.details?.treatment ? `<p><strong>Tratamiento:</strong> ${d.details.treatment}</p>` : ""}`;
      diagnosisContainer.appendChild(card);
    });
  } else {
    const p = document.createElement("p");
    p.textContent = "No se detectaron enfermedades o plagas.";
    diagnosisContainer.appendChild(p);
  }
}

// Mostrar errores
function showError(msg) {
  errorBox.classList.remove("hidden");
  errorMessage.textContent = msg;
  resultsSection.classList.add("hidden");
}

// Limpiar interfaz
function resetUI() {
  diagnosisContainer.innerHTML = "";
  rawJsonPre.textContent = "";
  errorBox.classList.add("hidden");
  resultsSection.classList.add("hidden");
}










