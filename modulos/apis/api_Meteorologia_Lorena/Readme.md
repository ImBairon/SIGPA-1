# 🌦️ Weather App

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
Se utilizó la API de **[OpenWeatherMap](https://openweathermap.org/)**.

### Obtener una API Key
1. Regístrate en [OpenWeatherMap](https://home.openweathermap.org/users/sign_up).
2. Confirma tu correo electrónico.
3. Ingresa a tu cuenta y ve a la sección **API keys**.
4. Copia tu clave (ejemplo: `1234567890abcdef`).
5. Pega tu API Key en el archivo `app.js` en la siguiente línea:

```js
const apiKey = "TU_API_KEY";
