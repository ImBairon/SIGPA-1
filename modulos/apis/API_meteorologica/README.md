🌦️ Módulo API Meteorológica

Este módulo obtiene información climática en tiempo real utilizando la API pública de [Open-Meteo](https://open-meteo.com/).  
Forma parte del sistema SIGPA
---

📌 Funcionalidades
- Búsqueda de clima por:
  - Nombre de ciudad (ej: *Bogotá*).
  - Coordenadas (ej: `4.61, -74.08`).
  - Geolocalización del navegador.
- Muestra:
  - 🌡️ Temperatura actual (°C)
  - 💧 Humedad relativa (%)
  - 🌬️ Velocidad del viento (km/h)
  - 🌦️ Probabilidad de precipitación (%)
  - 📅 Fecha y hora local
- Genera alertas dinámicas:
  - Probabilidad de lluvia ≥ 60% → “Evite realizar riegos”
  - Temperatura < 8 °C → “Riesgo de helada”
  - Temperatura > 32 °C → “Riesgo de golpe de calor”

---

🔗 APIs utilizadas
1. Open-Meteo Forecast API
Endpoint:
https://api.open-meteo.com/v1/forecast

Datos consultados:
- temperature_2m
- relative_humidity_2m
- wind_speed_10m
- precipitation
- precipitation_probability
- weathercode

Limitaciones:
- Sin API Key.
- Máx. 10.000 peticiones/día por IP.
- Datos horarios (POP por hora).

 2. Open-Meteo Geocoding API
Endpoint:
https://geocoding-api.open-meteo.com/v1/search

Funcionalidad:
- Convierte nombres de ciudades en coordenadas (lat, lon).
- Devuelve país y nombre estandarizado.

---

🖥️ Estructura del módulo
módulos/
apis/
API_meteorológica/
índice.html
estilos.css
aplicación.js
README.md

---

🚀 Uso
1. Abrir `índice.html` en un navegador.  
2. Buscar una ciudad o usar el botón de geolocalización.  
3. Ver datos climáticos y alertas en tiempo real.  

---

✅ Pruebas esperadas
- Ingresar **Bogotá** → muestra datos climáticos actuales.  
- Si POP ≥ 60% → alerta de riego.  
- Si T° < 8 °C → alerta de helada.  
- Si T° > 32 °C → alerta de golpe de calor.  

