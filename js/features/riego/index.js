/**
 * Módulo Riego para SIGPA Demo
 * Gestión de sectores de riego y programación
 *
 * NOTA: Este módulo está en desarrollo
 */
import { loadJson } from '../../core/json.repository.js';
import { showToast } from '../../core/ui.js';

/**
 * Montar el módulo Riego
 * @param {HTMLElement} rootEl - Elemento raíz donde montar el módulo
 * @returns {Object} Objeto con función unmount
 */
export const mount = async (rootEl) => {
    try {
        // Cargar datos (mantenemos la estructura para futuras implementaciones)
        const data = await loadJson('riego');

        // Renderizar contenido simplificado
        rootEl.innerHTML = renderRiego(data);

        // Event listeners básicos
        initializeEventListeners(rootEl);

        return {
            unmount: () => {
                // No hay limpieza necesaria en este momento
            }
        };
    } catch (error) {
        console.error('Error al montar módulo Riego:', error);
        rootEl.innerHTML = renderError();
        return { unmount: () => {} };
    }
};

/**
 * Renderizar contenido del módulo Riego (versión simplificada)
 * @param {Object} data - Datos del módulo
 * @returns {string} HTML del módulo
 */
const renderRiego = (data) => {
    return `
        <div class="container-fluid">
            <div class="row mb-4">
                <div class="col-12">
                    <h1 class="h2 mb-3">
                        <i class="bi bi-droplet text-info me-2"></i>
                        Gestión de Riego
                    </h1>
                    <p class="text-muted">Control y programación de sistemas de riego</p>
                </div>
            </div>

            <!-- Mensaje de desarrollo -->
            <div class="row mb-4">
                <div class="col-12">
                    <div class="alert alert-info" role="alert">
                        <div class="d-flex align-items-center">
                            <i class="bi bi-tools fs-4 me-3"></i>
                            <div>
                                <h5 class="alert-heading">Módulo en Desarrollo</h5>
                                <p class="mb-0">
                                    La funcionalidad completa de gestión de riego está siendo desarrollada.
                                    Próximamente incluirá control de sectores, programación automática y métricas de eficiencia.
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
                                <i class="bi bi-geo-alt text-primary me-2"></i>
                                Sectores de Riego
                            </h5>
                        </div>
                        <div class="card-body text-center py-5">
                            <i class="bi bi-geo-alt display-1 text-muted mb-3"></i>
                            <h5 class="text-muted">Funcionalidad en Desarrollo</h5>
                            <p class="text-muted mb-3">
                                Gestión de sectores de riego con control de humedad y programación automática
                            </p>
                            <button class="btn btn-outline-primary" id="previewSectorsBtn">
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
                                <i class="bi bi-graph-up text-success me-2"></i>
                                Métricas y Reportes
                            </h5>
                        </div>
                        <div class="card-body text-center py-5">
                            <i class="bi bi-graph-up display-1 text-muted mb-3"></i>
                            <h5 class="text-muted">Funcionalidad en Desarrollo</h5>
                            <p class="text-muted mb-3">
                                Análisis de eficiencia, consumo de agua y reportes detallados
                            </p>
                            <button class="btn btn-outline-success" id="previewMetricsBtn">
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
                    <div class="card border-primary">
                        <div class="card-header bg-primary text-white">
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
                                        <li><i class="bi bi-check-circle text-success me-2"></i>Control de sectores de riego</li>
                                        <li><i class="bi bi-check-circle text-success me-2"></i>Programación automática</li>
                                        <li><i class="bi bi-check-circle text-success me-2"></i>Monitoreo de humedad</li>
                                        <li><i class="bi bi-check-circle text-success me-2"></i>Métricas de eficiencia</li>
                                    </ul>
                                </div>
                                <div class="col-md-6">
                                    <h6>Estado Actual:</h6>
                                    <div class="d-flex align-items-center mb-2">
                                        <div class="progress flex-grow-1 me-2" style="height: 8px;">
                                            <div class="progress-bar bg-warning" style="width: 25%"></div>
                                        </div>
                                        <small class="text-muted">25%</small>
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
    // Botón vista previa sectores
    const previewSectorsBtn = rootEl.querySelector('#previewSectorsBtn');
    if (previewSectorsBtn) {
        previewSectorsBtn.addEventListener('click', () => {
            showToast('Vista previa de sectores en desarrollo', 'info');
        });
    }

    // Botón vista previa métricas
    const previewMetricsBtn = rootEl.querySelector('#previewMetricsBtn');
    if (previewMetricsBtn) {
        previewMetricsBtn.addEventListener('click', () => {
            showToast('Vista previa de métricas en desarrollo', 'info');
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
                    <p class="text-muted">No se pudieron cargar los datos de riego</p>
                    <button class="btn btn-primary" onclick="location.reload()">
                        Recargar página
                    </button>
                </div>
            </div>
        </div>
    `;
};
