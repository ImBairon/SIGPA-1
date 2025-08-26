/**
 * Módulo Clima para SIGPA Demo
 * Placeholder para funcionalidad de clima
 */
import { loadJson } from '../../core/json.repository.js';
import { showToast } from '../../core/ui.js';

/**
 * Montar el módulo Clima
 * @param {HTMLElement} rootEl - Elemento raíz donde montar el módulo
 * @returns {Object} Objeto con función unmount
 */
export const mount = async (rootEl) => {
    try {
        // Cargar datos
        const data = await loadJson('clima');

        // Renderizar contenido
        rootEl.innerHTML = renderClima(data);

        // Event listeners
        initializeEventListeners(rootEl);

        return {
            unmount: () => {
                // Limpiar event listeners
            }
        };
    } catch (error) {
        console.error('Error al montar módulo Clima:', error);
        rootEl.innerHTML = renderError();
        return { unmount: () => {} };
    }
};

/**
 * Renderizar contenido del módulo Clima
 * @param {Object} data - Datos del módulo
 * @returns {string} HTML del módulo
 */
const renderClima = (data) => {
    return `
        <div class="container-fluid">
            <div class="row mb-4">
                <div class="col-12">
                    <h1 class="h2 mb-3">
                        <i class="bi bi-cloud-sun text-warning me-2"></i>
                        Información Climática
                    </h1>
                    <p class="text-muted">Monitoreo y pronósticos del clima para optimizar la producción</p>
                </div>
            </div>

            <div class="row">
                <div class="col-12">
                    <div class="card">
                        <div class="card-body text-center py-5">
                            <i class="bi bi-cloud-rain display-1 text-muted"></i>
                            <h3 class="mt-3 text-muted">Módulo en Desarrollo</h3>
                            <p class="text-muted mb-4">
                                El módulo de clima estará disponible en la próxima versión.<br>
                                Incluirá datos meteorológicos en tiempo real y pronósticos.
                            </p>
                            <div class="row justify-content-center">
                                <div class="col-md-8">
                                    <div class="alert alert-info">
                                        <h5><i class="bi bi-info-circle me-2"></i>Próximas Funcionalidades</h5>
                                        <ul class="text-start mb-0">
                                            <li>Datos meteorológicos en tiempo real</li>
                                            <li>Pronósticos a 7 y 15 días</li>
                                            <li>Alertas de condiciones extremas</li>
                                            <li>Histórico climático</li>
                                            <li>Integración con estaciones meteorológicas</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
};

/**
 * Inicializar event listeners
 * @param {HTMLElement} rootEl - Elemento raíz
 */
const initializeEventListeners = (rootEl) => {
    // Placeholder para futuros event listeners
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
                    <h2 class="mt-3">Error al cargar clima</h2>
                    <p class="text-muted">No se pudo cargar el módulo de clima</p>
                    <button class="btn btn-primary" onclick="location.reload()">
                        Recargar página
                    </button>
                </div>
            </div>
        </div>
    `;
};
