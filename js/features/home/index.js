/**
 * Módulo Home para SIGPA Demo
 * Dashboard principal con estadísticas y actividades recientes
 */
import { loadJson } from '../../core/json.repository.js';
import { formatNumber, showToast } from '../../core/ui.js';

// Variables globales para los gráficos
let productionChart = null;
let efficiencyChart = null;

/**
 * Obtener colores de texto apropiados según el tema actual
 * @returns {Object} Objeto con colores para el tema actual
 */
const getThemeColors = () => {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';

    return {
        text: isDark ? '#f8fafc' : '#1e293b',
        gridLines: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        axisLabels: isDark ? '#f8fafc' : '#1e293b',
        title: isDark ? '#ffffff' : '#0f172a',
        legend: isDark ? '#f8fafc' : '#1e293b'
    };
};

/**
 * Actualizar colores de los gráficos según el tema actual
 */
const updateChartColors = () => {
    const themeColors = getThemeColors();

    // Actualizar gráfico de producción
    if (productionChart) {
        productionChart.options.plugins.title.color = themeColors.title;
        productionChart.options.plugins.legend.labels.color = themeColors.legend;
        productionChart.options.scales.x.ticks.color = themeColors.axisLabels;
        productionChart.options.scales.y.ticks.color = themeColors.axisLabels;
        productionChart.options.scales.x.grid.color = themeColors.gridLines;
        productionChart.options.scales.y.grid.color = themeColors.gridLines;
        productionChart.update();
    }

    // Actualizar gráfico de eficiencia
    if (efficiencyChart) {
        efficiencyChart.options.plugins.title.color = themeColors.title;
        efficiencyChart.options.plugins.legend.labels.color = themeColors.legend;
        efficiencyChart.update();
    }
};

/**
 * Montar el módulo Home
 * @param {HTMLElement} rootEl - Elemento raíz donde montar el módulo
 * @returns {Object} Objeto con función unmount
 */
export const mount = async (rootEl) => {
    try {
        // Cargar datos
        const data = await loadJson('home');

        // Renderizar contenido
        rootEl.innerHTML = renderHome(data);

        // Inicializar gráficos si están disponibles
        initializeCharts(data);

        // Event listeners
        initializeEventListeners(rootEl);

        // Escuchar cambios de tema
        const themeObserver = new MutationObserver(() => {
            updateChartColors();
        });

        themeObserver.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['data-theme']
        });

        return {
            unmount: () => {
                // Limpiar gráficos y event listeners
                cleanupCharts();
                themeObserver.disconnect();
            }
        };
    } catch (error) {
        console.error('Error al montar módulo Home:', error);
        rootEl.innerHTML = renderError();
        return { unmount: () => {} };
    }
};

/**
 * Renderizar contenido del Home
 * @param {Object} data - Datos del módulo
 * @returns {string} HTML del módulo
 */
const renderHome = (data) => {
    return `
        <div class="container-fluid">
            <div class="row mb-4">
                <div class="col-12">
                    <h1 class="h2 mb-3">
                        <i class="bi bi-house-door text-primary me-2"></i>
                        Dashboard Principal
                    </h1>
                    <p class="text-muted">Bienvenido al sistema de gestión de producción agrícola</p>
                </div>
            </div>

            <!-- Estadísticas principales -->
            <div class="row mb-4">
                ${renderStats(data.stats)}
            </div>

            <div class="row">
                <!-- Actividades recientes -->
                <div class="col-lg-8 mb-4">
                    <div class="card h-100">
                        <div class="card-header">
                            <h5 class="card-title mb-0">
                                <i class="bi bi-activity text-info me-2"></i>
                                Actividades Recientes
                            </h5>
                        </div>
                        <div class="card-body">
                            ${renderRecentActivities(data.recentActivities)}
                        </div>
                    </div>
                </div>

                <!-- Información del clima -->
                <div class="col-lg-4 mb-4">
                    <div class="card h-100">
                        <div class="card-header">
                            <h5 class="card-title mb-0">
                                <i class="bi bi-cloud-sun text-warning me-2"></i>
                                Clima
                            </h5>
                        </div>
                        <div class="card-body">
                            ${renderWeather(data.weather)}
                        </div>
                    </div>
                </div>
            </div>

            <!-- Gráficos -->
            <div class="row">
                <div class="col-12">
                    <div class="card">
                        <div class="card-header">
                            <h5 class="card-title mb-0">
                                <i class="bi bi-graph-up text-success me-2"></i>
                                Resumen de Producción
                            </h5>
                        </div>
                        <div class="card-body">
                            <div class="row">
                                <div class="col-lg-6 col-md-12 mb-4">
                                    <div class="chart-container" style="position: relative; height: 300px;">
                                        <canvas id="productionChart"></canvas>
                                    </div>
                                </div>
                                <div class="col-lg-6 col-md-12 mb-4">
                                    <div class="chart-container" style="position: relative; height: 300px;">
                                        <canvas id="efficiencyChart"></canvas>
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
 * Renderizar estadísticas
 * @param {Array} stats - Array de estadísticas
 * @returns {string} HTML de las estadísticas
 */
const renderStats = (stats) => {
    return stats.map(stat => `
        <div class="col-xl-3 col-md-6 mb-4">
            <div class="card border-left-${stat.color} shadow h-100 py-2">
                <div class="card-body">
                    <div class="row no-gutters align-items-center">
                        <div class="col mr-2">
                            <div class="text-xs font-weight-bold text-${stat.color} text-uppercase mb-1">
                                ${stat.title}
                            </div>
                            <div class="h5 mb-0 font-weight-bold text-gray-800">
                                ${formatNumber(stat.value)}
                            </div>
                        </div>
                        <div class="col-auto">
                            <i class="${stat.icon} fa-2x text-gray-300"></i>
                        </div>
                    </div>
                    <div class="mt-2">
                        <span class="text-${stat.changeType === 'positive' ? 'success' : 'danger'}">
                            <i class="bi bi-arrow-${stat.changeType === 'positive' ? 'up' : 'down'}"></i>
                            ${stat.change}
                        </span>
                        <small class="text-muted">vs mes anterior</small>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
};

/**
 * Renderizar actividades recientes
 * @param {Array} activities - Array de actividades
 * @returns {string} HTML de las actividades
 */
const renderRecentActivities = (activities) => {
    if (!activities || activities.length === 0) {
        return '<p class="text-muted">No hay actividades recientes</p>';
    }

    return `
        <div class="list-group list-group-flush">
            ${activities.map(activity => `
                <div class="list-group-item d-flex align-items-center">
                    <div class="flex-shrink-0">
                        <i class="${activity.icon} text-${activity.color} fs-4"></i>
                    </div>
                    <div class="flex-grow-1 ms-3">
                        <p class="mb-1">${activity.message}</p>
                        <small class="text-muted">${activity.time}</small>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
};

/**
 * Renderizar información del clima
 * @param {Object} weather - Datos del clima
 * @returns {string} HTML del clima
 */
const renderWeather = (weather) => {
    if (!weather) return '<p class="text-muted">Información no disponible</p>';

    return `
        <div class="text-center mb-3">
            <i class="${weather.current.icon} display-4 text-warning"></i>
            <h3 class="mt-2">${weather.current.temperature}°C</h3>
            <p class="text-muted mb-0">${weather.current.description}</p>
            <small class="text-muted">Humedad: ${weather.current.humidity}%</small>
        </div>

        <div class="border-top pt-3">
            <h6 class="mb-3">Pronóstico</h6>
            ${weather.forecast.map(day => `
                <div class="d-flex justify-content-between align-items-center mb-2">
                    <span>${day.day}</span>
                    <div class="d-flex align-items-center">
                        <i class="${day.icon} me-2"></i>
                        <span>${day.high}° / ${day.low}°</span>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
};

/**
 * Inicializar gráficos
 * @param {Object} data - Datos para los gráficos
 */
const initializeCharts = (data) => {
    // Obtener colores del tema actual
    const themeColors = getThemeColors();

    // Gráfico de producción
    const productionCtx = document.getElementById('productionChart');
    if (productionCtx && window.Chart) {
        productionChart = new Chart(productionCtx, {
            type: 'line',
            data: {
                labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
                datasets: [{
                    label: 'Producción (ton)',
                    data: [120, 135, 128, 142, 138, 145],
                    borderColor: 'rgb(75, 192, 192)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    tension: 0.1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'Evolución de Producción',
                        color: themeColors.title,
                        font: {
                            size: 16,
                            weight: 'bold'
                        }
                    },
                    legend: {
                        labels: {
                            color: themeColors.legend,
                            font: {
                                size: 12
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        ticks: {
                            color: themeColors.axisLabels,
                            font: {
                                size: 11
                            }
                        },
                        grid: {
                            color: themeColors.gridLines
                        }
                    },
                    y: {
                        ticks: {
                            color: themeColors.axisLabels,
                            font: {
                                size: 11
                            }
                        },
                        grid: {
                            color: themeColors.gridLines
                        }
                    }
                }
            }
        });
    }

    // Gráfico de eficiencia
    const efficiencyCtx = document.getElementById('efficiencyChart');
    if (efficiencyCtx && window.Chart) {
        efficiencyChart = new Chart(efficiencyCtx, {
            type: 'doughnut',
            data: {
                labels: ['Excelente', 'Buena', 'Regular', 'Mejorable'],
                datasets: [{
                    data: [45, 30, 20, 5],
                    backgroundColor: [
                        'rgb(40, 167, 69)',
                        'rgb(255, 193, 7)',
                        'rgb(255, 152, 0)',
                        'rgb(220, 53, 69)'
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'Estado de Cultivos',
                        color: themeColors.title,
                        font: {
                            size: 16,
                            weight: 'bold'
                        }
                    },
                    legend: {
                        labels: {
                            color: themeColors.legend,
                            font: {
                                size: 12
                            }
                        }
                    }
                }
            }
        });
    }
};

/**
 * Inicializar event listeners
 * @param {HTMLElement} rootEl - Elemento raíz
 */
const initializeEventListeners = (rootEl) => {
    // Event listeners para las tarjetas de estadísticas
    const statCards = rootEl.querySelectorAll('.card');
    statCards.forEach(card => {
        card.addEventListener('click', () => {
            showToast('Funcionalidad en desarrollo', 'info');
        });
    });
};

/**
 * Limpiar gráficos
 */
const cleanupCharts = () => {
    // Destruir gráficos si existen
    if (productionChart) {
        productionChart.destroy();
        productionChart = null;
    }
    if (efficiencyChart) {
        efficiencyChart.destroy();
        efficiencyChart = null;
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
                    <p class="text-muted">No se pudieron cargar los datos del dashboard</p>
                    <button class="btn btn-primary" onclick="location.reload()">
                        Recargar página
                    </button>
                </div>
            </div>
        </div>
    `;
};
