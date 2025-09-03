/**
 * Router basado en hash para SIGPA Demo
 * Maneja la navegación entre módulos sin recargar la página
 */
import { loadJson } from './json.repository.js';

/**
 * Configuración de rutas
 */
const routes = [
    {
        path: '/',
        title: 'Home',
        mount: async (rootEl) => {
            const { mount } = await import('../features/home/index.js');
            return mount(rootEl);
        },
        unmount: async () => {
            const { unmount } = await import('../features/home/index.js');
            return unmount();
        }
    },
    {
        path: '/riego',
        title: 'Riego',
        mount: async (rootEl) => {
            const { mount } = await import('../features/riego/index.js');
            return mount(rootEl);
        },
        unmount: async () => {
            const { unmount } = await import('../features/riego/index.js');
            return unmount();
        }
    },
    {
        path: '/calendario',
        title: 'Calendario',
        mount: async (rootEl) => {
            const { mount } = await import('../features/calendario/index.js');
            return mount(rootEl);
        },
        unmount: async () => {
            const { unmount } = await import('../features/calendario/index.js');
            return unmount();
        }
    },
    {
        path: '/alertas',
        title: 'Alertas',
        mount: async (rootEl) => {
            const { mount } = await import('../features/alertas/index.js');
            return mount(rootEl);
        },
        unmount: async () => {
            const { unmount } = await import('../features/alertas/index.js');
            return unmount();
        }
    },
    {
        path: '/crecimiento',
        title: 'Crecimiento',
        mount: async (rootEl) => {
            const { mount } = await import('../features/crecimiento/index.js');
            return mount(rootEl);
        },
        unmount: async () => {
            const { unmount } = await import('../features/crecimiento/index.js');
            return unmount();
        }
    },
    {
        path: '/clima',
        title: 'Clima',
        mount: async (rootEl) => {
            const { mount } = await import('../features/clima/index.js');
            return mount(rootEl);
        },
        unmount: async () => {
            const { unmount } = await import('../features/clima/index.js');
            return unmount();
        }
    },
    {
        path: '/mis-cultivos',
        title: 'Mis Cultivos',
        mount: async (rootEl) => {
            const { mount } = await import('../features/mis-cultivos/index.js');
            return mount(rootEl);
        },
        unmount: async () => {
            const { unmount } = await import('../features/mis-cultivos/index.js');
            return unmount();
        }
    },
    {
        path: '/perfil',
        title: 'Perfil',
        mount: async (rootEl) => {
            const { mount } = await import('../features/perfil/index.js');
            return mount(rootEl);
        },
        unmount: async () => {
            const { unmount } = await import('../features/perfil/index.js');
            return unmount();
        }
    }
];

/**
 * Clase Router para manejar navegación
 */
class Router {
    constructor() {
        this.currentRoute = null;
        this.currentModule = null;
        this.rootElement = null;
        this.isInitialized = false;
    }

    /**
     * Inicializar el router
     */
    initialize() {
        if (this.isInitialized) {
            return;
        }

        this.rootElement = document.getElementById('view-root');
        if (!this.rootElement) {
            console.error('❌ Elemento view-root no encontrado');
            return;
        }

        // Event listener para cambios de hash
        window.addEventListener('hashchange', () => {
            this.handleRouteChange();
        });

        // También escuchar cambios de hash programáticos
        window.addEventListener('popstate', () => {
            this.handleRouteChange();
        });

        // Manejar ruta inicial
        this.handleRouteChange();

        this.isInitialized = true;
    }

    /**
     * Manejar cambio de ruta
     */
    async handleRouteChange() {
        const hash = window.location.hash || '#/';

        const route = this.findRoute(hash);

        if (!route) {
            console.warn('⚠️ Ruta no encontrada, mostrando 404');
            this.showNotFound();
            return;
        }

        // Desmontar módulo actual si existe
        if (this.currentModule && this.currentModule.unmount) {
            try {
                await this.currentModule.unmount();
            } catch (error) {
                console.error('Error al desmontar módulo:', error);
            }
        }

        // Actualizar título de la página
        document.title = `SIGPA – ${route.title}`;

        // Actualizar item activo en sidebar
        this.updateActiveSidebarItem(hash);

        // Montar nuevo módulo
        try {
            this.currentModule = await route.mount(this.rootElement);
            this.currentRoute = route;
        } catch (error) {
            console.error('❌ Error al montar módulo:', error);
            this.showError();
        }
    }

    /**
     * Encontrar ruta por hash
     * @param {string} hash - Hash de la URL
     * @returns {Object|null} Ruta encontrada
     */
    findRoute(hash) {
        return routes.find(route => `#${route.path}` === hash);
    }

    /**
     * Actualizar item activo en sidebar
     * @param {string} hash - Hash actual
     */
    updateActiveSidebarItem(hash) {
        const sidebarLinks = document.querySelectorAll('.c-sidebar__link');

        sidebarLinks.forEach(link => {
            link.removeAttribute('aria-current');
            if (link.getAttribute('href') === hash) {
                link.setAttribute('aria-current', 'page');
            }
        });
    }

    /**
     * Mostrar página 404
     */
    showNotFound() {
        if (this.rootElement) {
            this.rootElement.innerHTML = `
                <div class="text-center py-5">
                    <h1 class="display-1 text-muted">404</h1>
                    <h2>Página no encontrada</h2>
                    <p class="text-muted">La ruta solicitada no existe.</p>
                    <a href="#/" class="btn btn-primary">Volver al inicio</a>
                </div>
            `;
        }
        document.title = 'SIGPA – Página no encontrada';
    }

    /**
     * Mostrar error
     */
    showError() {
        if (this.rootElement) {
            this.rootElement.innerHTML = `
                <div class="text-center py-5">
                    <h1 class="text-danger">
                        <i class="bi bi-exclamation-triangle"></i>
                        Error
                    </h1>
                    <p class="text-muted">Ocurrió un error al cargar el módulo.</p>
                    <button onclick="location.reload()" class="btn btn-primary">
                        Recargar página
                    </button>
                </div>
            `;
        }
    }

    /**
     * Navegar a una ruta específica
     * @param {string} path - Ruta a navegar
     */
    navigate(path) {
        window.location.hash = path;
    }

    /**
     * Obtener ruta actual
     * @returns {Object|null} Ruta actual
     */
    getCurrentRoute() {
        return this.currentRoute;
    }

    /**
     * Obtener hash actual
     * @returns {string} Hash actual
     */
    getCurrentHash() {
        return window.location.hash || '#/';
    }
}

// Crear instancia global del router
const router = new Router();

// Hacer disponible globalmente
window.router = router;

// Exportar para uso en otros módulos
export { router };
