/**
 * Módulo Crecimiento para SIGPA Demo
 * Placeholder para funcionalidad de métricas de crecimiento
 */
import { loadJson } from '../../core/json.repository.js';
import { showToast } from '../../core/ui.js';

/**
 * Montar el módulo Crecimiento
 * @param {HTMLElement} rootEl - Elemento raíz donde montar el módulo
 * @returns {Object} Objeto con función unmount
 */
export const mount = async (rootEl) => {
    try {
        // Cargar datos
        const data = await loadJson('crecimiento');

        // Renderizar contenido
        rootEl.innerHTML = renderCrecimiento(data);

        // Event listeners
        initializeEventListeners(rootEl);

        return {
            unmount: () => {
                // Limpiar event listeners
            }
        };
    } catch (error) {
        console.error('Error al montar módulo Crecimiento:', error);
        rootEl.innerHTML = renderError();
        return { unmount: () => {} };
    }
};

/**
 * Renderizar contenido del módulo Crecimiento
 * @param {Object} data - Datos del módulo
 * @returns {string} HTML del módulo
 */
const renderCrecimiento = (data) => {
    return `
        <div class="container-fluid">
            <div class="row mb-4">
                <div class="col-12">
                    <h1 class="h2 mb-3">
                        <i class="bi bi-graph-up text-success me-2"></i>
                        Métricas de Crecimiento
                    </h1>
                    <p class="text-muted">Análisis y seguimiento del desarrollo de cultivos</p>
                </div>
            </div>

            <div class="row">
                <div class="col-12">
                    <div class="card">
                        <div class="card-body text-center py-5">
                            <i class="bi bi-bar-chart display-1 text-muted"></i>
                            <h3 class="mt-3 text-muted">Funcionalidad en Desarrollo</h3>
                            <p class="text-muted mb-4">
                                El módulo de métricas de crecimiento estará disponible en la próxima versión.<br>
                                Incluirá análisis detallado y visualización de datos de desarrollo.
                            </p>
                            <div class="row justify-content-center">
                                <div class="col-md-8">
                                    <div class="alert alert-info">
                                        <h5><i class="bi bi-info-circle me-2"></i>Próximas Funcionalidades</h5>
                                        <ul class="text-start mb-0">
                                            <li>Gráficos de crecimiento por cultivo</li>
                                            <li>Análisis de rendimiento histórico</li>
                                            <li>Comparación entre variedades</li>
                                            <li>Predicciones de cosecha</li>
                                            <li>Reportes personalizables</li>
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
                    <h2 class="mt-3">Error al cargar métricas</h2>
                    <p class="text-muted">No se pudo cargar el módulo de crecimiento</p>
                    <button class="btn btn-primary" onclick="location.reload()">
                        Recargar página
                    </button>
                </div>
            </div>
        </div>
    `;
};
