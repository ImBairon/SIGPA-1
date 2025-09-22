/**
 * Maneja la autenticación y redirecciones
 */
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import { auth } from './firebase.app.js';
import { loadPartial } from './ui.js';

/**
 * Inicializar sistema de guardias
 */
export const initializeGuard = () => {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            // Usuario autenticado
            handleAuthenticatedUser(user);
        } else {
            // Usuario no autenticado
            handleUnauthenticatedUser();
        }
    });
};

/**
 * Manejar usuario autenticado
 * @param {Object} user - Usuario de Firebase Auth
 */
const handleAuthenticatedUser = (user) => {
    const currentPath = window.location.pathname;

    // Si está en la página de login, redirigir al dashboard
    if (
        currentPath.includes('index.html') ||
        currentPath === '/' ||
        currentPath === ''
    ) {
        window.location.href = './dashboard.html';
        return;
    }

    // Si está en dashboard, cargar la interfaz
    if (currentPath.includes('dashboard.html')) {
        loadDashboardInterface(user);
    }
};

/**
 * Manejar usuario no autenticado
 */
const handleUnauthenticatedUser = () => {
    const currentPath = window.location.pathname;

    // Si está en dashboard sin autenticación, redirigir al login
    if (currentPath.includes('dashboard.html')) {
        window.location.href = './index.html';
        return;
    }
};

/**
 * Cargar interfaz del dashboard
 * @param {Object} user - Usuario autenticado
 */
const loadDashboardInterface = async (user) => {
    try {
        // Cargar sidebar
        const sidebarRoot = document.getElementById('sidebar-root');
        if (sidebarRoot) {
            await loadPartial('partials/sidebar.html', sidebarRoot);
            initializeSidebar();
        }

        // Cargar topbar
        const topbarRoot = document.getElementById('topbar-root');
        if (topbarRoot) {
            await loadPartial('partials/topbar.html', topbarRoot);
            initializeTopbar(user);
        }

        // Inicializar router
        await initializeRouter();
    } catch (error) {
        console.error('Error al cargar interfaz del dashboard:', error);
    }
};

/**
 * Inicializar sidebar
 */
const initializeSidebar = () => {
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebarClose = document.getElementById('sidebarClose');
    const sidebar = document.querySelector('.c-sidebar');
    const sidebarOverlay = document.getElementById('sidebarOverlay');
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');

    // Toggle para desktop (colapsar/expandir)
    if (sidebarToggle && sidebar) {
        sidebarToggle.addEventListener('click', () => {
            sidebar.classList.toggle('c-sidebar--collapsed');

            // Actualizar icono
            const icon = sidebarToggle.querySelector('i');
            if (icon) {
                icon.style.transform = sidebar.classList.contains(
                    'c-sidebar--collapsed'
                )
                    ? 'rotate(180deg)'
                    : 'rotate(0deg)';
            }
        });
    }

    // Cerrar sidebar móvil
    if (sidebarClose && sidebar) {
        sidebarClose.addEventListener('click', () => {
            closeMobileSidebar();
        });
    }

    // Botón de menú móvil
    if (mobileMenuBtn && sidebar) {
        mobileMenuBtn.addEventListener('click', () => {
            openMobileSidebar();
        });
    }

    // Overlay para cerrar sidebar móvil
    if (sidebarOverlay) {
        sidebarOverlay.addEventListener('click', () => {
            closeMobileSidebar();
        });
    }

    // Inicializar enlaces de navegación
    initializeSidebarNavigation();

    // Marcar item activo en sidebar
    updateActiveSidebarItem();
};

/**
 * Abrir sidebar móvil
 */
const openMobileSidebar = () => {
    const sidebar = document.querySelector('.c-sidebar');
    const overlay = document.getElementById('sidebarOverlay');

    if (sidebar && overlay) {
        sidebar.classList.add('is-visible');
        overlay.classList.add('is-visible');
        document.body.style.overflow = 'hidden';
    }
};

/**
 * Cerrar sidebar móvil
 */
const closeMobileSidebar = () => {
    const sidebar = document.querySelector('.c-sidebar');
    const overlay = document.getElementById('sidebarOverlay');

    if (sidebar && overlay) {
        sidebar.classList.remove('is-visible');
        overlay.classList.remove('is-visible');
        document.body.style.overflow = '';
    }
};

/**
 * Actualizar item activo en sidebar
 */
const updateActiveSidebarItem = () => {
    const currentHash = window.location.hash || '#/';
    const sidebarLinks = document.querySelectorAll('.c-sidebar__link');

    sidebarLinks.forEach((link) => {
        link.removeAttribute('aria-current');
        if (link.getAttribute('href') === currentHash) {
            link.setAttribute('aria-current', 'page');
        }
    });
};

/**
 * Inicializar topbar
 * @param {Object} user - Usuario autenticado
 */
const initializeTopbar = (user) => {
    // Actualizar información del usuario
    updateUserInfo(user);

    // Inicializar menú de perfil
    initializeProfileMenu(user);

    // Inicializar selector de tema
    initializeThemeSelector();

    // Inicializar reloj
    if (window.clock) {
        window.clock.start();
    }
};

/**
 * Actualizar información del usuario en el topbar
 * @param {Object} user - Usuario autenticado
 */
const updateUserInfo = (user) => {
    const profileAvatar = document.getElementById('profileAvatar');
    const profileName = document.getElementById('profileName');

    if (profileAvatar) {
        profileAvatar.src = user.photoURL || './assets/default-avatar.png';
        profileAvatar.alt = user.displayName || 'Usuario';
    }

    if (profileName) {
        profileName.textContent = user.displayName || user.email || 'Usuario';
    }
};

/**
 * Inicializar menú de perfil
 * @param {Object} user - Usuario autenticado
 */
const initializeProfileMenu = (user) => {
    const profileButton = document.getElementById('profileButton');
    const profileMenu = document.getElementById('profileMenu');
    const logoutItem = document.getElementById('logoutItem');

    if (!profileButton || !profileMenu) return;

    let isMenuOpen = false;

    // Toggle del menú
    profileButton.addEventListener('click', () => {
        isMenuOpen = !isMenuOpen;
        if (isMenuOpen) {
            profileMenu.style.display = 'block';
            // Pequeño delay para la transición
            setTimeout(() => {
                profileMenu.classList.add('is-visible');
            }, 10);
        } else {
            profileMenu.classList.remove('is-visible');
            // Esperar a que termine la transición antes de ocultar
            setTimeout(() => {
                profileMenu.style.display = 'none';
            }, 200);
        }
        profileButton.setAttribute('aria-expanded', isMenuOpen);
    });

    // Cerrar con Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && isMenuOpen) {
            closeProfileMenu();
        }
    });

    // Cerrar con click fuera
    document.addEventListener('click', (e) => {
        if (
            !profileButton.contains(e.target) &&
            !profileMenu.contains(e.target)
        ) {
            closeProfileMenu();
        }
    });

    // Navegación a perfil
    const editProfileLink = profileMenu.querySelector('#editProfileLink');
    if (editProfileLink) {
        editProfileLink.addEventListener('click', async (e) => {
            e.preventDefault();

            // Cerrar el menú primero
            closeProfileMenu();

            // Pequeño delay para asegurar que el menú se cierre
            await new Promise((resolve) => setTimeout(resolve, 100));

            try {
                // Navegar a la ruta de perfil
                window.location.hash = '#/perfil';

                // También llamar al router directamente
                if (window.router && window.router.handleRouteChange) {
                    await window.router.handleRouteChange();
                } else {
                    console.log(
                        '⚠️ Router no disponible, navegando solo con hash'
                    );
                }
            } catch (error) {
                console.error('Error al navegar a perfil:', error);
                // Fallback: recargar la página con el hash
                window.location.reload();
            }
        });
    }

    // Logout
    if (logoutItem) {
        logoutItem.addEventListener('click', async () => {
            try {
                const { logout } = await import('./auth.js');
                await logout();
                window.location.href = './index.html';
            } catch (error) {
                console.error('Error en logout:', error);
            }
        });
    }

    /**
     * Cerrar menú de perfil
     */
    const closeProfileMenu = () => {
        isMenuOpen = false;
        profileMenu.classList.remove('is-visible');
        // Esperar a que termine la transición antes de ocultar
        setTimeout(() => {
            profileMenu.style.display = 'none';
        }, 200);
        profileButton.setAttribute('aria-expanded', 'false');
    };
};

/**
 * Inicializar selector de tema
 */
const initializeThemeSelector = async () => {
    try {
        const { setTheme, getCurrentTheme, getThemeLabel } = await import(
            './theme.js'
        );

        const themeDropdown = document.getElementById('themeDropdown');
        const themeText = document.getElementById('themeText');
        const themeDropdownMenu = document.getElementById('themeDropdownMenu');

        if (!themeDropdown || !themeText || !themeDropdownMenu) return;

        /**
         * Actualizar texto del botón de tema
         */
        const updateThemeText = (theme) => {
            themeText.textContent = getThemeLabel(theme);
        };

        /**
         * Actualizar estado visual de las opciones
         */
        const updateActiveThemeOption = (theme) => {
            // Remover clase activa de todas las opciones
            document.querySelectorAll('.theme-option').forEach((option) => {
                option.classList.remove('is-active');
            });

            // Agregar clase activa a la opción seleccionada
            const activeOption = document.querySelector(
                `[data-theme="${theme}"]`
            );
            if (activeOption) {
                activeOption.classList.add('is-active');
            }
        };

        /**
         * Alternar visibilidad del menú
         */
        const toggleThemeMenu = () => {
            const isVisible =
                themeDropdownMenu.classList.contains('is-visible');
            const ariaExpanded =
                themeDropdown.getAttribute('aria-expanded') === 'true';

            if (isVisible) {
                themeDropdownMenu.classList.remove('is-visible');
                themeDropdown.setAttribute('aria-expanded', 'false');
            } else {
                themeDropdownMenu.classList.add('is-visible');
                themeDropdown.setAttribute('aria-expanded', 'true');
            }
        };

        /**
         * Cerrar menú de tema
         */
        const closeThemeMenu = () => {
            themeDropdownMenu.classList.remove('is-visible');
            themeDropdown.setAttribute('aria-expanded', 'false');
        };

        // Cargar tema actual
        const currentTheme = getCurrentTheme();
        updateThemeText(currentTheme);
        updateActiveThemeOption(currentTheme);

        // Event listener para el botón principal
        themeDropdown.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleThemeMenu();
        });

        // Event listeners para las opciones de tema
        const themeItems = document.querySelectorAll('.theme-option');
        themeItems.forEach((item, index) => {
            // Agregar índice para animaciones
            item.style.setProperty('--item-index', index);

            item.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();

                const theme = item.dataset.theme;
                setTheme(theme);
                updateThemeText(theme);
                updateActiveThemeOption(theme);
                closeThemeMenu();
            });
        });

        // Cerrar menú al hacer clic fuera
        document.addEventListener('click', (e) => {
            if (
                !themeDropdown.contains(e.target) &&
                !themeDropdownMenu.contains(e.target)
            ) {
                closeThemeMenu();
            }
        });

        // Cerrar menú con Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                closeThemeMenu();
            }
        });

        // Aplicar tema inicial
        setTheme(currentTheme);
    } catch (error) {
        console.error('Error al inicializar selector de tema:', error);
    }
};

/**
 * Inicializar el router
 */
const initializeRouter = async () => {
    try {
        // Esperar a que el router esté disponible
        let attempts = 0;
        const maxAttempts = 10;

        while (!window.router && attempts < maxAttempts) {
            await new Promise((resolve) => setTimeout(resolve, 100));
            attempts++;
        }

        if (window.router) {
            window.router.initialize();
        } else {
            console.error('Router no disponible después de múltiples intentos');
        }
    } catch (error) {
        console.error('Error al inicializar router:', error);
    }
};

/**
 * Inicializar navegación del sidebar
 */
const initializeSidebarNavigation = () => {
    // Buscar todos los enlaces del sidebar
    const sidebarLinks = document.querySelectorAll('.c-sidebar__link');

    sidebarLinks.forEach((link, index) => {
        const href = link.getAttribute('href');
        // Remover event listeners existentes para evitar duplicados
        link.removeEventListener('click', handleSidebarLinkClick);

        // Agregar event listener personalizado
        link.addEventListener('click', handleSidebarLinkClick);
    });
};

/**
 * Manejar click en enlaces del sidebar
 */
const handleSidebarLinkClick = (event) => {
    event.preventDefault();

    const link = event.currentTarget;
    const href = link.getAttribute('href');

    // Cambiar el hash manualmente
    window.location.hash = href;

    // También llamar al router directamente por si acaso
    if (window.router && window.router.handleRouteChange) {
        window.router.handleRouteChange();
    }
};

// Inicializar guard cuando se carga el módulo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeGuard);
} else {
    initializeGuard();
}
