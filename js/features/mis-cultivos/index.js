/**
 * Módulo Mis Cultivos para SIGPA Demo
 * Gestión y visualización de cultivos del usuario
 *
 * NOTA: Este módulo está en desarrollo
 */
import { loadJson } from '../../core/json.repository.js';
import { showToast } from '../../core/ui.js';

/**
 * Montar el módulo Mis Cultivos
 * @param {HTMLElement} rootEl - Elemento raíz donde montar el módulo
 * @returns {Object} Objeto con función unmount
 */
export const mount = async (rootEl) => {
    try {
        // Cargar datos (mantenemos la estructura para futuras implementaciones)
        const data = await loadJson('mis-cultivos');

        // Renderizar contenido simplificado
        rootEl.innerHTML = renderMisCultivos(data);

        // Event listeners básicos
        initializeEventListeners(rootEl);

        return {
            unmount: () => {
                // No hay limpieza necesaria en este momento
            }
        };
    } catch (error) {
        console.error('Error al montar módulo Mis Cultivos:', error);
        rootEl.innerHTML = renderError();
        return { unmount: () => {} };
    }
};

/**
 * Renderizar contenido del módulo Mis Cultivos (versión simplificada)
 * @param {Object} data - Datos del módulo
 * @returns {string} HTML del módulo
 */
const renderMisCultivos = (data) => {
    return `
        <div class="container-fluid">
            <div class="row mb-4">
                <div class="col-12">
                    <h1 class="h2 mb-3">
                        <i class="bi bi-seed text-success me-2"></i>
                        Mis Cultivos
                    </h1>
                    <p class="text-muted">Gestión y seguimiento de tus cultivos</p>
                </div>
            </div>

            <!-- Mensaje de desarrollo -->
            <div class="row mb-4">
                <div class="col-12">
                    <div class="alert alert-success" role="alert">
                        <div class="d-flex align-items-center">
                            <i class="bi bi-tools fs-4 me-3"></i>
                            <div>
                                <h5 class="alert-heading">Módulo en Desarrollo</h5>
                                <p class="mb-0">
                                    La funcionalidad completa de gestión de cultivos está siendo desarrollada.
                                    Próximamente incluirá seguimiento de crecimiento, métricas de rendimiento y planificación de cosechas.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Vista previa de funcionalidades -->
            <div class="row">
                <div class="col-lg-6 col-md-12 mb-4">
                    <div class="card h-100">
                        <div class="card-header">
                            <h5 class="card-title mb-0">
                                <i class="bi bi-seed text-success me-2"></i>
                                Gestión de Cultivos
                            </h5>
                        </div>
                        <div class="card-body text-center py-5">
                            <i class="bi bi-seed display-1 text-muted mb-3"></i>
                            <h5 class="text-muted">Funcionalidad en Desarrollo</h5>
                            <p class="text-muted mb-3">
                                Registro, seguimiento y gestión completa de cultivos con métricas de crecimiento
                            </p>
                            <button class="btn btn-outline-success" id="previewCropsBtn">
                                <i class="bi bi-eye"></i>
                                Vista Previa
                            </button>
                        </div>
                    </div>
                </div>

                <div class="col-lg-6 col-md-12 mb-4">
                    <div class="card h-100">
                        <div class="card-header">
                            <h5 class="card-title mb-0">
                                <i class="bi bi-graph-up text-info me-2"></i>
                                Análisis y Reportes
                            </h5>
                        </div>
                        <div class="card-body text-center py-5">
                            <i class="bi bi-graph-up display-1 text-muted mb-3"></i>
                            <h5 class="text-muted">Funcionalidad en Desarrollo</h5>
                            <p class="text-muted mb-3">
                                Análisis de rendimiento, predicciones de cosecha y reportes detallados
                            </p>
                            <button class="btn btn-outline-info" id="previewAnalyticsBtn">
                                <i class="bi bi-eye"></i>
                                Vista Previa
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Información del proyecto -->
            <div class="row mt-4">
                <div class="col-12">
                    <div class="card border-success">
                        <div class="card-header bg-success text-white">
                            <h5 class="card-title mb-0">
                                <i class="bi bi-info-circle me-2"></i>
                                Información del Proyecto
                            </h5>
                        </div>
                        <div class="card-body">
                            <div class="row">
                                <div class="col-md-6">
                                    <h6>Funcionalidades Planificadas:</h6>
                                    <ul class="list-unstyled">
                                        <li><i class="bi bi-check-circle text-success me-2"></i>Registro de cultivos</li>
                                        <li><i class="bi bi-check-circle text-success me-2"></i>Seguimiento de crecimiento</li>
                                        <li><i class="bi bi-check-circle text-success me-2"></i>Métricas de rendimiento</li>
                                        <li><i class="bi bi-check-circle text-success me-2"></i>Planificación de cosechas</li>
                                    </ul>
                                </div>
                                <div class="col-md-6">
                                    <h6>Estado Actual:</h6>
                                    <div class="d-flex align-items-center mb-2">
                                        <div class="progress flex-grow-1 me-2" style="height: 8px;">
                                            <div class="progress-bar bg-warning" style="width: 20%"></div>
                                        </div>
                                        <small class="text-muted">20%</small>
                                    </div>
                                    <p class="text-muted small mb-0">
                                        En fase de diseño y desarrollo de la interfaz de usuario
                                    </p>
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
 * Inicializar event listeners básicos
 * @param {HTMLElement} rootEl - Elemento raíz
 */
const initializeEventListeners = (rootEl) => {
    // Botón vista previa cultivos
    const previewCropsBtn = rootEl.querySelector('#previewCropsBtn');
    if (previewCropsBtn) {
        previewCropsBtn.addEventListener('click', () => {
            showToast('Vista previa de gestión de cultivos en desarrollo', 'info');
        });
    }

    // Botón vista previa análisis
    const previewAnalyticsBtn = rootEl.querySelector('#previewAnalyticsBtn');
    if (previewAnalyticsBtn) {
        previewAnalyticsBtn.addEventListener('click', () => {
            showToast('Vista previa de análisis en desarrollo', 'info');
        });
    }
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
                    <h2 class="mt-3">Error al cargar datos</h2>
                    <p class="text-muted">No se pudieron cargar los datos de cultivos</p>
                    <button class="btn btn-primary" onclick="location.reload()">
                        Recargar página
                    </button>
                </div>
            </div>
        </div>
    `;
};
