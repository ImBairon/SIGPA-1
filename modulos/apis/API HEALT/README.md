🚀 Características
Diagnóstico de la salud de los cultivos a partir de imágenes.
Análisis y visualización de:
🌱 Enfermedades presentes en la planta
🐛 Posibles plagas
🍂 Deficiencias nutricionales
📊 Nivel de severidad y recomendaciones de manejo
🖼️ Procesamiento de imágenes cargadas desde el dispositivo

Interfaz sencilla con HTML, CSS y JavaScript puro.

🔑 API utilizada
Esta aplicación usa la API Crop.Health (beta) de Kindwise, diseñada para detectar enfermedades y problemas en cultivos a partir de imágenes.

⚠️ Limitaciones del Plan Gratuito
⏱️ Créditos permitidos
✅ 100 créditos mensuales en la versión beta
❌ Si se superan los créditos, la API dejará de procesar imágenes hasta el siguiente ciclo

📷 Requisitos de las imágenes
✅ Formato aceptado: JPEG / PNG
✅ Tamaño máximo: 5 MB
✅ También se acepta imagen en Base64

🌍 Puntos finales disponibles
✅ Diagnóstico de cultivos (/diagnosis)
✅ Historial de diagnósticos por usuario (/history)
✅ Recomendaciones de manejo (/recommendations)

❌ No disponible en el plan gratuito:
Datos históricos detallados de la finca
Predicciones basadas en múltiples temporadas
Análisis masivo de imágenes

🛠️ Tecnologías

HTML5

CSS3

JavaScript (Vanilla JS)

API Crop.Health (beta) de Kindwise

📁 Estructura del proyecto
crop-health-app/
├── index.html
├── styles.css
├── app.js
└── README.md
