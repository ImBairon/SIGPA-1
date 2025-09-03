/**
 * Módulo Calendario para SIGPA Demo
 * Placeholder para funcionalidad de calendario
 */
import { loadJson } from '../../core/json.repository.js';
import { showToast } from '../../core/ui.js';

/**
 * Montar el módulo Calendario
 * @param {HTMLElement} rootEl - Elemento raíz donde montar el módulo
 * @returns {Object} Objeto con función unmount
 */
export const mount = async (rootEl) => {
    try {
        // Cargar datos
        const data = await loadJson('calendario');

        // Renderizar contenido
        rootEl.innerHTML = renderCalendario(data);

        // Event listeners
        initializeEventListeners(rootEl);

        return {
            unmount: () => {
                // Limpiar event listeners
            }
        };
    } catch (error) {
        console.error('Error al montar módulo Calendario:', error);
        rootEl.innerHTML = renderError();
        return { unmount: () => {} };
    }
};

/**
 * Renderizar contenido del módulo Calendario
 * @param {Object} data - Datos del módulo
 * @returns {string} HTML del módulo
 */
const renderCalendario = (data) => {
    return `
        <div class="container-fluid">
            <div class="row mb-4">
                <div class="col-12">
                    <h1 class="h2 mb-3">
                        <i class="bi bi-calendar-event text-primary me-2"></i>
                        Calendario de Actividades
                    </h1>
                    <p class="text-muted">Programa y gestiona las actividades agrícolas</p>
                </div>
            </div>

            <div class="row">
                <div class="col-12">
                    <div class="card">
                        <div class="card-body text-center py-5">
                            <i class="bi bi-calendar-plus display-1 text-muted"></i>
                            <h3 class="mt-3 text-muted">Funcionalidad en Desarrollo</h3>
                            <p class="text-muted mb-4">
                                El módulo de calendario estará disponible en la próxima versión.<br>
                                Incluirá programación de actividades, recordatorios y seguimiento de tareas.
                            </p>
                            <div class="row justify-content-center">
                                <div class="col-md-8">
                                    <div class="alert alert-info">
                                        <h5><i class="bi bi-info-circle me-2"></i>Próximas Funcionalidades</h5>
                                        <ul class="text-start mb-0">
                                            <li>Vista de calendario mensual y semanal</li>
                                            <li>Programación de riego automático</li>
                                            <li>Recordatorios de fertilización</li>
                                            <li>Seguimiento de cosechas</li>
                                            <li>Notificaciones push</li>
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
                    <h2 class="mt-3">Error al cargar calendario</h2>
                    <p class="text-muted">No se pudo cargar el módulo de calendario</p>
                    <button class="btn btn-primary" onclick="location.reload()">
                        Recargar página
                    </button>
                </div>
            </div>
        </div>
    `;
};
