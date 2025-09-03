// Coordenadas de Chiquinquirá, Colombia
const lat = 5.6167;
const lon = -73.8186;

async function obtenerClima() {
  try {
    const respuesta = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weathercode`
    );
    const datos = await respuesta.json();

    // Extraer información
    const temperatura = datos.current.temperature_2m;
    const humedad = datos.current.relative_humidity_2m;
    const estado = interpretarClima(datos.current.weathercode);

    // Mostrar en la web
    document.getElementById("temperatura").textContent = temperatura;
    document.getElementById("humedad").textContent = humedad;
    document.getElementById("estado").textContent = estado;
  } catch (error) {
    console.error("Error al obtener datos del clima:", error);
  }
}

// Función para interpretar el código del clima
function interpretarClima(codigo) {
  switch (codigo) {
    case 0: return "Despejado";
    case 1:
    case 2:
    case 3: return "Parcialmente nublado";
    case 45:
    case 48: return "Niebla";
    case 51:
    case 61: return "Lluvia ligera";
    case 63:
    case 65: return "Lluvia fuerte";
    case 71: return "Nieve ligera";
    case 80:
    case 81: return "Chubascos";
    default: return "Desconocido";
  }
}

// Llamar la función al cargar la página
obtenerClima();
