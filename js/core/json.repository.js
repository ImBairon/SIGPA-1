/**
 * Carga datos JSON con caché en memoria
 */

// Caché en memoria para los datos JSON
const jsonCache = new Map();

/**
 * Cargar archivo JSON con caché
 * @param {string} name - Nombre del archivo JSON
 * @returns {Promise<Object>} Datos del archivo JSON
 */
export const loadJson = async (name) => {
    // Verificar si ya está en caché
    if (jsonCache.has(name)) {
        return jsonCache.get(name);
    }

    try {
        const response = await fetch(`./data/${name}.json`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        // Guardar en caché
        jsonCache.set(name, data);

        return data;
    } catch (error) {
        console.error(`Error al cargar JSON ${name}:`, error);

        // Retornar datos de ejemplo en caso de error
        return getFallbackData(name);
    }
};

/**
 * Obtener datos de fallback en caso de error
 * @param {string} name - Nombre del archivo
 * @returns {Object} Datos de ejemplo
 */
const getFallbackData = (name) => {
    const fallbackData = {
        home: {
            stats: [
                { id: 1, title: 'Cultivos Activos', value: 0, icon: 'bi-seed', color: 'success' },
                { id: 2, title: 'Hectáreas', value: 0, icon: 'bi-geo-alt', color: 'primary' }
            ],
            recentActivities: [],
            weather: { current: { temperature: 0, humidity: 0, description: 'N/A' } }
        },
        riego: {
            sectors: [],
            schedule: [],
            statistics: { totalWaterUsed: 0, averageEfficiency: 0, totalArea: 0 }
        },
        calendario: {
            events: [],
            tasks: []
        },
        alertas: {
            alerts: [],
            notifications: []
        },
        crecimiento: {
            metrics: [],
            charts: []
        },
        clima: {
            current: { temperature: 0, humidity: 0, description: 'N/A' },
            forecast: []
        },
        'mis-cultivos': {
            crops: [],
            statistics: { totalCrops: 0, totalArea: 0, averageYield: 0 },
            recentActivities: []
        }
    };

    return fallbackData[name] || { error: 'Datos no disponibles' };
};

/**
 * Limpiar caché
 * @param {string} name - Nombre específico a limpiar (opcional)
 */
export const clearCache = (name = null) => {
    if (name) {
        jsonCache.delete(name);
    } else {
        jsonCache.clear();
    }
};

/**
 * Verificar si un archivo está en caché
 * @param {string} name - Nombre del archivo
 * @returns {boolean}
 */
export const isCached = (name) => {
    return jsonCache.has(name);
};

/**
 * Obtener tamaño del caché
 * @returns {number}
 */
export const getCacheSize = () => {
    return jsonCache.size;
};

/**
 * Precargar archivos JSON específicos
 * @param {string[]} names - Array de nombres de archivos
 * @returns {Promise<void>}
 */
export const preloadJson = async (names) => {
    const promises = names.map(name => loadJson(name));
    await Promise.all(promises);
};

/**
 * Obtener estadísticas del caché
 * @returns {Object}
 */
export const getCacheStats = () => {
    return {
        size: jsonCache.size,
        keys: Array.from(jsonCache.keys()),
        memoryUsage: 'N/A' // En navegadores no podemos medir uso de memoria
    };
};
