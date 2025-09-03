/**
 * Maneja la persistencia y aplicación de temas (claro/oscuro/sistema)
 */

/**
 * Obtener el tema actual del localStorage
 * @returns {string} El tema actual ('light', 'dark', o 'system')
 */
export const getCurrentTheme = () => {
    return localStorage.getItem('sigpa-theme') || 'system';
};

/**
 * Establecer un tema específico
 * @param {string} theme - El tema a establecer ('light', 'dark', o 'system')
 */
export const setTheme = (theme) => {
    // Validar tema
    if (!['light', 'dark', 'system'].includes(theme)) {
        console.warn(`Tema inválido: ${theme}. Usando 'system' por defecto.`);
        theme = 'system';
    }

    // Guardar en localStorage
    localStorage.setItem('sigpa-theme', theme);

    // Aplicar tema al documento
    applyTheme(theme);
};

/**
 * Aplicar tema al documento HTML
 * @param {string} theme - El tema a aplicar
 */
const applyTheme = (theme) => {
    let finalTheme = theme;

    // Si es 'system', detectar preferencia del sistema
    if (theme === 'system') {
        finalTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    // Aplicar tema al documento
    document.documentElement.setAttribute('data-theme', finalTheme);

    // Disparar evento personalizado para notificar cambios
    document.dispatchEvent(new CustomEvent('themeChanged', {
        detail: { theme: finalTheme, originalTheme: theme }
    }));
};

/**
 * Inicializar el sistema de temas
 * Aplica el tema guardado y configura listeners para cambios del sistema
 */
export const initializeTheme = () => {
    const currentTheme = getCurrentTheme();

    // Aplicar tema inicial
    applyTheme(currentTheme);

    // Configurar listener para cambios de preferencia del sistema
    if (window.matchMedia) {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

        const handleSystemThemeChange = (e) => {
            // Solo cambiar si el tema actual es 'system'
            if (getCurrentTheme() === 'system') {
                applyTheme('system');
            }
        };

        // Agregar listener (compatible con navegadores modernos y legacy)
        if (mediaQuery.addEventListener) {
            mediaQuery.addEventListener('change', handleSystemThemeChange);
        } else if (mediaQuery.addListener) {
            mediaQuery.addListener(handleSystemThemeChange);
        }
    }
};

/**
 * Obtener etiqueta legible del tema
 * @param {string} theme - El tema ('light', 'dark', o 'system')
 * @returns {string} La etiqueta legible del tema
 */
export const getThemeLabel = (theme) => {
    const labels = {
        light: 'Claro',
        dark: 'Oscuro',
        system: 'Sistema'
    };
    return labels[theme] || 'Tema';
};

/**
 * Alternar entre tema claro y oscuro
 * @returns {string} El nuevo tema establecido
 */
export const toggleTheme = () => {
    const currentTheme = getCurrentTheme();
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    return newTheme;
};

// Inicializar tema cuando se carga el módulo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeTheme);
} else {
    initializeTheme();
}
