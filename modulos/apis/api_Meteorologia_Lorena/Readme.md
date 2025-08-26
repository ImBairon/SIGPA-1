Aplicación web simple que consume la **API pública de OpenWeatherMap** para mostrar el clima actual de cualquier ciudad.  
Incluye información como: temperatura, humedad, descripción del clima y un ícono representativo.

---

## 🚀 Características

- Búsqueda del clima por ciudad.
- Visualización de:
  - 🌡️ Temperatura
  - 💧 Humedad
  - ☁️ Descripción del clima
  - 🌦️ Ícono del estado del tiempo
- Interfaz sencilla con HTML, CSS y JavaScript puro.

---

## 🔑 API Utilizada

Se utilizó la API de **[OpenWeatherMap](https://openweathermap.org/)** bajo el **plan gratuito (Free Tier)**.

### 🔧 Obtener una API Key

1. Regístrate en [OpenWeatherMap](https://home.openweathermap.org/users/sign_up).
2. Confirma tu correo electrónico.
3. Ingresa a tu cuenta y ve a la sección **API keys**.
4. Copia tu clave (ejemplo: `1234567890abcdef`).
5. Pega tu API Key en el archivo `app.js` en la siguiente línea:

```js
const apiKey = "TU_API_KEY";
```

### ⚠️ Limitaciones del Plan Gratuito de OpenWeatherMap

⏱️ **Llamadas permitidas**  
✅ 60 solicitudes por minuto  
✅ 1,000,000 solicitudes al mes  
❌ Si excedes estos límites, recibirás errores (ej. HTTP 429 - Too Many Requests)

🔄 **Frecuencia de actualización**  
Los datos meteorológicos se actualizan aproximadamente cada 10 minutos.

🌍 **Endpoints disponibles**  
✅ Clima actual (`/weather`)  
✅ Pronóstico de 5 días / cada 3 horas (`/forecast`)  
✅ Mapas básicos  

❌ No disponibles en el plan gratuito:  
- Datos históricos detallados  
- Pronósticos a largo plazo (más de 5 días)  
- Datos climáticos de alta resolución

🏙️ **Búsqueda por ciudad**  
La búsqueda puede ser ambigua si hay varias ciudades con el mismo nombre.  
🔎 Recomendación: usa también el código de país, ejemplo: `Paris,FR` o `Lima,PE`.

🌐 **Idioma y unidades**  
Idioma por defecto: inglés  
Unidades por defecto: Kelvin  
Puedes cambiarlo agregando parámetros a la URL:

```
&lang=es        // Idioma en español  
&units=metric   // Celsius
```

**Unidades disponibles:**
- `standard` → Kelvin
- `metric` → Celsius
- `imperial` → Fahrenheit


---

## 🛠️ Tecnologías

- HTML5  
- CSS3  
- JavaScript (Vanilla JS)  
- OpenWeatherMap API (Plan gratuito)

---

## 📁 Estructura del proyecto

```
weather-app/
├── index.html
├── styles.css
├── app.js
└── README.md
```

---


