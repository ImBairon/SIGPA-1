/**
 * Módulo Clima para SIGPA Demo
 * Conectado con Open-Meteo API para datos en tiempo real (gratuita, sin API key)
 */
import { loadJson } from '../../core/json.repository.js';
import { showToast } from '../../core/ui.js';

// Coordenadas de Chiquinquirá, Colombia
const CLIMA_CONFIG = {
    lat: 5.6167,
    lon: -73.8186,
    ciudad: 'Chiquinquirá, Colombia',
    BASE_URL: 'https://api.open-meteo.com/v1'
};

/**
 * Montar el módulo Clima
 * @param {HTMLElement} rootEl - Elemento raíz donde montar el módulo
 * @returns {Object} Objeto con función unmount
 */
export const mount = async (rootEl) => {
    try {
        let climaData = null;
        let pronostico = null;
        
        // Cargar datos del clima actual y pronóstico
        try {
            [climaData, pronostico] = await Promise.all([
                obtenerClimaActual(),
                obtenerPronostico()
            ]);
        } catch (error) {
            console.error('Error al obtener datos del clima:', error);
            climaData = null;
            pronostico = null;
        }

        rootEl.innerHTML = renderClima(climaData, pronostico);
        initializeEventListeners(rootEl, climaData, pronostico);
        
        // Actualizar cada 10 minutos
        const intervalId = setInterval(async () => {
            try {
                const [nuevoClima, nuevoPronostico] = await Promise.all([
                    obtenerClimaActual(),
                    obtenerPronostico()
                ]);
                actualizarInterfaz(rootEl, nuevoClima, nuevoPronostico);
                showToast('Datos del clima actualizados', 'success');
            } catch (error) {
                console.error('Error al actualizar clima:', error);
                showToast('Error al actualizar datos del clima', 'error');
            }
        }, 600000); // 10 minutos

        return {
            unmount: () => {
                if (intervalId) {
                    clearInterval(intervalId);
                }
            }
        };
    } catch (error) {
        console.error('Error al montar módulo Clima:', error);
        rootEl.innerHTML = renderError();
        return { unmount: () => {} };
    }
};

/**
 * Obtener clima actual desde Open-Meteo
 * @returns {Promise<Object>} Datos del clima actual
 */
const obtenerClimaActual = async () => {
    const { lat, lon } = CLIMA_CONFIG;
    const url = `${CLIMA_CONFIG.BASE_URL}/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weathercode,wind_speed_10m,wind_direction_10m,pressure_msl,visibility&daily=sunrise,sunset&timezone=America/Bogota`;
    
    const respuesta = await fetch(url);
    
    if (!respuesta.ok) {
        throw new Error(`Error HTTP: ${respuesta.status}`);
    }
    
    const datos = await respuesta.json();
    
    return {
        temperatura: Math.round(datos.current.temperature_2m),
        humedad: datos.current.relative_humidity_2m,
        presion: Math.round(datos.current.pressure_msl || 0),
        visibilidad: datos.current.visibility ? Math.round(datos.current.visibility / 1000) : 'N/A',
        viento: {
            velocidad: Math.round((datos.current.wind_speed_10m || 0) * 3.6), // km/h
            direccion: datos.current.wind_direction_10m || 0
        },
        estado: interpretarClima(datos.current.weathercode),
        codigoClima: datos.current.weathercode,
        amanecer: datos.daily?.sunrise?.[0] ? new Date(datos.daily.sunrise[0]).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' }) : 'N/A',
        atardecer: datos.daily?.sunset?.[0] ? new Date(datos.daily.sunset[0]).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' }) : 'N/A',
        ubicacion: CLIMA_CONFIG.ciudad,
        ultimaActualizacion: new Date().toLocaleTimeString('es-CO')
    };
};

/**
 * Obtener pronóstico de 7 días desde Open-Meteo
 * @returns {Promise<Array>} Pronóstico de 7 días
 */
const obtenerPronostico = async () => {
    const { lat, lon } = CLIMA_CONFIG;
    const url = `${CLIMA_CONFIG.BASE_URL}/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min,weathercode,precipitation_probability_max&timezone=America/Bogota`;
    
    const respuesta = await fetch(url);
    
    if (!respuesta.ok) {
        throw new Error(`Error HTTP: ${respuesta.status}`);
    }
    
    const datos = await respuesta.json();
    
    if (!datos.daily) return [];
    
    return datos.daily.time.slice(0, 7).map((fecha, index) => ({
        fecha: new Date(fecha),
        tempMax: Math.round(datos.daily.temperature_2m_max[index]),
        tempMin: Math.round(datos.daily.temperature_2m_min[index]),
        estado: interpretarClima(datos.daily.weathercode[index]),
        codigoClima: datos.daily.weathercode[index],
        probabilidadLluvia: Math.round(datos.daily.precipitation_probability_max[index] || 0)
    }));
};

/**
 * Función para interpretar el código del clima
 * @param {number} codigo - Código del clima de Open-Meteo
 * @returns {string} Descripción del clima
 */
function interpretarClima(codigo) {
    switch (codigo) {
        case 0: return "Despejado";
        case 1:
        case 2:
        case 3: return "Parcialmente nublado";
        case 45:
        case 48: return "Niebla";
        case 51:
        case 53:
        case 55: return "Llovizna";
        case 61:
        case 63: return "Lluvia ligera";
        case 65:
        case 67: return "Lluvia fuerte";
        case 71:
        case 73:
        case 75: return "Nieve";
        case 77: return "Granizo";
        case 80:
        case 81:
        case 82: return "Chubascos";
        case 85:
        case 86: return "Nieve con chubascos";
        case 95: return "Tormenta";
        case 96:
        case 99: return "Tormenta con granizo";
        default: return "Desconocido";
    }
}

/**
 * Obtener icono del clima basado en el código
 * @param {number} codigo - Código del clima
 * @returns {string} Clase del icono Bootstrap
 */
const obtenerIconoClima = (codigo) => {
    switch (codigo) {
        case 0: return "bi-sun";
        case 1:
        case 2:
        case 3: return "bi-cloud-sun";
        case 45:
        case 48: return "bi-cloud-fog";
        case 51:
        case 53:
        case 55:
        case 61:
        case 63: return "bi-cloud-drizzle";
        case 65:
        case 67:
        case 80:
        case 81:
        case 82: return "bi-cloud-rain";
        case 71:
        case 73:
        case 75:
        case 85:
        case 86: return "bi-cloud-snow";
        case 77: return "bi-cloud-hail";
        case 95:
        case 96:
        case 99: return "bi-cloud-lightning";
        default: return "bi-question-circle";
    }
};

/**
 * Obtener color del icono basado en el código
 * @param {number} codigo - Código del clima
 * @returns {string} Clase de color
 */
const obtenerColorClima = (codigo) => {
    switch (codigo) {
        case 0: return "text-warning"; // Soleado
        case 1:
        case 2:
        case 3: return "text-info"; // Parcialmente nublado
        case 45:
        case 48: return "text-secondary"; // Niebla
        case 51:
        case 53:
        case 55:
        case 61:
        case 63:
        case 65:
        case 67:
        case 80:
        case 81:
        case 82: return "text-primary"; // Lluvia
        case 71:
        case 73:
        case 75:
        case 85:
        case 86: return "text-light"; // Nieve
        case 77: return "text-secondary"; // Granizo
        case 95:
        case 96:
        case 99: return "text-danger"; // Tormenta
        default: return "text-muted";
    }
};

/**
 * Obtener dirección del viento en texto
 * @param {number} grados - Dirección en grados
 * @returns {string} Dirección en texto
 */
const obtenerDireccionViento = (grados) => {
    const direcciones = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSO', 'SO', 'OSO', 'O', 'ONO', 'NO', 'NNO'];
    const indice = Math.round(grados / 22.5) % 16;
    return direcciones[indice];
};

/**
 * Renderizar contenido del módulo Clima
 * @param {Object} climaData - Datos del clima actual
 * @param {Array} pronostico - Datos del pronóstico
 * @returns {string} HTML del módulo
 */
const renderClima = (climaData, pronostico) => {
    if (!climaData) {
        return renderSinDatos();
    }

    const direccionViento = obtenerDireccionViento(climaData.viento.direccion);
    const iconoClima = obtenerIconoClima(climaData.codigoClima);
    const colorClima = obtenerColorClima(climaData.codigoClima);
    
    return `
        <div class="container-fluid">
            <div class="row mb-4">
                <div class="col-12">
                    <h1 class="h2 mb-3">
                        <i class="bi bi-cloud-sun text-warning me-2"></i>
                        Información Climática
                    </h1>
                    <p class="text-muted">Datos en tiempo real de ${climaData.ubicacion} - Última actualización: ${climaData.ultimaActualizacion}</p>
                </div>
            </div>

            <!-- Clima Actual -->
            <div class="row mb-4">
                <div class="col-12">
                    <div class="card border-primary">
                        <div class="card-header bg-primary text-white">
                            <h5 class="mb-0"><i class="bi bi-thermometer-half me-2"></i>Clima Actual</h5>
                        </div>
                        <div class="card-body">
                            <div class="row align-items-center">
                                <div class="col-md-4 text-center">
                                    <i class="bi ${iconoClima} ${colorClima}" style="font-size: 5rem;"></i>
                                    <h3 class="display-4 mb-0" id="temperatura">${climaData.temperatura}°C</h3>
                                    <p class="text-capitalize fw-bold" id="estado">${climaData.estado}</p>
                                </div>
                                <div class="col-md-8">
                                    <div class="row">
                                        <div class="col-sm-6 mb-3">
                                            <div class="d-flex align-items-center">
                                                <i class="bi bi-droplet text-info fs-4 me-2"></i>
                                                <div>
                                                    <strong>Humedad</strong><br>
                                                    <span id="humedad">${climaData.humedad}%</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-sm-6 mb-3">
                                            <div class="d-flex align-items-center">
                                                <i class="bi bi-speedometer text-secondary fs-4 me-2"></i>
                                                <div>
                                                    <strong>Presión</strong><br>
                                                    <span id="presion">${climaData.presion} hPa</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-sm-6 mb-3">
                                            <div class="d-flex align-items-center">
                                                <i class="bi bi-wind text-primary fs-4 me-2"></i>
                                                <div>
                                                    <strong>Viento</strong><br>
                                                    <span id="viento">${climaData.viento.velocidad} km/h ${direccionViento}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-sm-6 mb-3">
                                            <div class="d-flex align-items-center">
                                                <i class="bi bi-eye text-success fs-4 me-2"></i>
                                                <div>
                                                    <strong>Visibilidad</strong><br>
                                                    <span id="visibilidad">${climaData.visibilidad} km</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            ${climaData.amanecer !== 'N/A' && climaData.atardecer !== 'N/A' ? `
                            <hr>
                            <div class="row text-center">
                                <div class="col-6">
                                    <i class="bi bi-sunrise text-warning fs-5 me-1"></i>
                                    <strong>Amanecer:</strong> ${climaData.amanecer}
                                </div>
                                <div class="col-6">
                                    <i class="bi bi-sunset text-warning fs-5 me-1"></i>
                                    <strong>Atardecer:</strong> ${climaData.atardecer}
                                </div>
                            </div>
                            ` : ''}
                        </div>
                    </div>
                </div>
            </div>

            <!-- Pronóstico -->
            ${pronostico && pronostico.length > 0 ? renderPronostico(pronostico) : ''}

            <!-- Alertas Climáticas -->
            ${renderAlertas(climaData)}

            <!-- Botones de Acción -->
            <div class="row mt-4">
                <div class="col-12 text-center">
                    <button class="btn btn-primary me-2" id="actualizar-clima">
                        <i class="bi bi-arrow-clockwise me-1"></i>
                        Actualizar Datos
                    </button>
                    <button class="btn btn-outline-secondary" id="exportar-datos">
                        <i class="bi bi-download me-1"></i>
                        Exportar Datos
                    </button>
                </div>
            </div>
        </div>
    `;
};

/**
 * Renderizar pronóstico de 7 días
 * @param {Array} pronostico - Datos del pronóstico
 * @returns {string} HTML del pronóstico
 */
const renderPronostico = (pronostico) => {
    const diasSemana = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    
    const pronosticoHTML = pronostico.map((dia, index) => {
        const nombreDia = index === 0 ? 'Hoy' : (index === 1 ? 'Mañana' : diasSemana[dia.fecha.getDay()]);
        const fechaCorta = dia.fecha.toLocaleDateString('es-CO', { day: '2-digit', month: '2-digit' });
        const iconoClima = obtenerIconoClima(dia.codigoClima);
        const colorClima = obtenerColorClima(dia.codigoClima);
        
        return `
            <div class="col-lg-1 col-md-2 col-sm-3 col-4 mb-3">
                <div class="card h-100 text-center">
                    <div class="card-body p-2">
                        <h6 class="card-title mb-1 small">${nombreDia}</h6>
                        <small class="text-muted d-block mb-2">${fechaCorta}</small>
                        <i class="bi ${iconoClima} ${colorClima} mb-2" style="font-size: 2rem;"></i>
                        <div class="mb-1">
                            <small class="fw-bold text-danger">${dia.tempMax}°</small>
                            <small class="text-muted">/${dia.tempMin}°</small>
                        </div>
                        <small class="text-capitalize d-block mb-1" style="font-size: 0.75rem;">${dia.estado}</small>
                        <small class="text-info">
                            <i class="bi bi-droplet"></i> ${dia.probabilidadLluvia}%
                        </small>
                    </div>
                </div>
            </div>
        `;
    }).join('');
    
    return `
        <div class="row mb-4">
            <div class="col-12">
                <div class="card">
                    <div class="card-header">
                        <h5 class="mb-0"><i class="bi bi-calendar-week me-2"></i>Pronóstico de 7 días</h5>
                    </div>
                    <div class="card-body">
                        <div class="row" id="pronostico-container">
                            ${pronosticoHTML}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
};

/**
 * Renderizar alertas climáticas
 * @param {Object} climaData - Datos del clima
 * @returns {string} HTML de alertas
 */
const renderAlertas = (climaData) => {
    const alertas = [];
    
    // Temperatura extrema
    if (climaData.temperatura > 35) {
        alertas.push({
            tipo: 'warning',
            icono: 'bi-thermometer-high',
            mensaje: 'Temperatura alta. Mantén hidratadas las plantas y considera riego adicional.'
        });
    } else if (climaData.temperatura < 5) {
        alertas.push({
            tipo: 'info',
            icono: 'bi-thermometer-low',
            mensaje: 'Temperatura baja. Protege cultivos sensibles al frío.'
        });
    }
    
    // Humedad extrema
    if (climaData.humedad > 85) {
        alertas.push({
            tipo: 'warning',
            icono: 'bi-droplet-fill',
            mensaje: 'Humedad alta. Vigila posibles enfermedades fúngicas en cultivos.'
        });
    } else if (climaData.humedad < 30) {
        alertas.push({
            tipo: 'info',
            icono: 'bi-droplet-half',
            mensaje: 'Baja humedad. Considera aumentar el riego.'
        });
    }
    
    // Viento fuerte
    if (climaData.viento.velocidad > 40) {
        alertas.push({
            tipo: 'danger',
            icono: 'bi-wind',
            mensaje: 'Vientos fuertes. Protege estructuras y cultivos vulnerables.'
        });
    }
    
    if (alertas.length === 0) return '';
    
    const alertasHTML = alertas.map(alerta => `
        <div class="alert alert-${alerta.tipo} d-flex align-items-center" role="alert">
            <i class="bi ${alerta.icono} me-2"></i>
            <div>${alerta.mensaje}</div>
        </div>
    `).join('');
    
    return `
        <div class="row mb-4">
            <div class="col-12">
                <div class="card border-warning">
                    <div class="card-header bg-warning text-dark">
                        <h5 class="mb-0"><i class="bi bi-exclamation-triangle me-2"></i>Alertas Climáticas</h5>
                    </div>
                    <div class="card-body">
                        ${alertasHTML}
                    </div>
                </div>
            </div>
        </div>
    `;
};

/**
 * Renderizar cuando no hay datos disponibles
 * @returns {string} HTML para estado sin datos
 */
const renderSinDatos = () => {
    return `
        <div class="container-fluid">
            <div class="row mb-4">
                <div class="col-12">
                    <h1 class="h2 mb-3">
                        <i class="bi bi-cloud-sun text-warning me-2"></i>
                        Información Climática
                    </h1>
                </div>
            </div>
            <div class="row">
                <div class="col-12">
                    <div class="card border-warning">
                        <div class="card-body text-center py-5">
                            <i class="bi bi-exclamation-triangle display-1 text-warning"></i>
                            <h3 class="mt-3">No se pudieron obtener datos del clima</h3>
                            <p class="text-muted mb-4">Verifica tu conexión a internet</p>
                            <button class="btn btn-warning" id="reintentar-clima">
                                <i class="bi bi-arrow-clockwise me-1"></i>
                                Reintentar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
};

/**
 * Actualizar la interfaz con nuevos datos
 * @param {HTMLElement} rootEl - Elemento raíz
 * @param {Object} climaData - Nuevos datos del clima
 * @param {Array} pronostico - Nuevo pronóstico
 */
const actualizarInterfaz = (rootEl, climaData, pronostico) => {
    if (!climaData) return;
    
    // Actualizar elementos específicos sin recargar toda la interfaz
    const elementos = {
        '#temperatura': `${climaData.temperatura}°C`,
        '#estado': climaData.estado,
        '#humedad': `${climaData.humedad}%`,
        '#presion': `${climaData.presion} hPa`,
        '#viento': `${climaData.viento.velocidad} km/h ${obtenerDireccionViento(climaData.viento.direccion)}`,
        '#visibilidad': `${climaData.visibilidad} km`
    };
    
    Object.entries(elementos).forEach(([selector, valor]) => {
        const elemento = rootEl.querySelector(selector);
        if (elemento) {
            elemento.textContent = valor;
        }
    });
};

/**
 * Inicializar event listeners
 * @param {HTMLElement} rootEl - Elemento raíz
 * @param {Object} climaData - Datos del clima
 * @param {Array} pronostico - Pronóstico
 */
const initializeEventListeners = (rootEl, climaData, pronostico) => {
    // Botón actualizar
    const btnActualizar = rootEl.querySelector('#actualizar-clima');
    if (btnActualizar) {
        btnActualizar.addEventListener('click', async () => {
            try {
                btnActualizar.disabled = true;
                btnActualizar.innerHTML = '<i class="bi bi-arrow-clockwise me-1 spinner-border spinner-border-sm"></i>Actualizando...';
                
                const [nuevoClima, nuevoPronostico] = await Promise.all([
                    obtenerClimaActual(),
                    obtenerPronostico()
                ]);
                
                actualizarInterfaz(rootEl, nuevoClima, nuevoPronostico);
                showToast('Datos actualizados correctamente', 'success');
            } catch (error) {
                console.error('Error al actualizar:', error);
                showToast('Error al actualizar los datos', 'error');
            } finally {
                btnActualizar.disabled = false;
                btnActualizar.innerHTML = '<i class="bi bi-arrow-clockwise me-1"></i>Actualizar Datos';
            }
        });
    }
    
    // Botón exportar
    const btnExportar = rootEl.querySelector('#exportar-datos');
    if (btnExportar) {
        btnExportar.addEventListener('click', () => {
            if (climaData) {
                exportarDatos(climaData, pronostico);
            }
        });
    }
    
    // Botón reintentar (cuando no hay datos)
    const btnReintentar = rootEl.querySelector('#reintentar-clima');
    if (btnReintentar) {
        btnReintentar.addEventListener('click', () => {
            location.reload();
        });
    }
};

/**
 * Exportar datos del clima a JSON
 * @param {Object} climaData - Datos del clima actual
 * @param {Array} pronostico - Datos del pronóstico
 */
const exportarDatos = (climaData, pronostico) => {
    const datos = {
        fechaExportacion: new Date().toISOString(),
        climaActual: climaData,
        pronostico: pronostico || []
    };
    
    const blob = new Blob([JSON.stringify(datos, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `clima_chiquinquira_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showToast('Datos exportados correctamente', 'success');
};

/**
 * Renderizar error
 * @returns {string} HTML de error
 */
const renderError = () => {
    return `
        <div class="container-fluid">
            <div class="row">
                <div class="col-12 text-center py-5">
                    <div class="text-danger">
                        <i class="bi bi-exclamation-triangle display-1"></i>
                    </div>
                    <h2 class="mt-3">Error al cargar módulo de clima</h2>
                    <p class="text-muted">Se produjo un error inesperado al cargar el módulo</p>
                    <button class="btn btn-primary" onclick="location.reload()">
                        <i class="bi bi-arrow-clockwise me-1"></i>
                        Recargar página
                    </button>
                </div>
            </div>
        </div>
    `;
};

