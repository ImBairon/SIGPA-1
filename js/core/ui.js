/**
 * Funciones helper para manipulación del DOM y carga de parciales
 */

/**
 * Cargar un parcial HTML en un elemento
 * @param {string} path - Ruta al archivo parcial
 * @param {HTMLElement} targetElement - Elemento donde cargar el parcial
 * @returns {Promise<void>}
 */
export const loadPartial = async (path, targetElement) => {
    try {
        const response = await fetch(path);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const html = await response.text();
        targetElement.innerHTML = html;
    } catch (error) {
        console.error(`Error al cargar parcial ${path}:`, error);
        targetElement.innerHTML = `
            <div class="alert alert-danger">
                <i class="bi bi-exclamation-triangle"></i>
                Error al cargar contenido
            </div>
        `;
    }
};

/**
 * Selector de elementos con querySelector
 * @param {string} selector - Selector CSS
 * @param {HTMLElement} parent - Elemento padre
 * @returns {HTMLElement|null}
 */
export const qs = (selector, parent = document) => {
    return parent.querySelector(selector);
};

/**
 * Selector de elementos con querySelectorAll
 * @param {string} selector - Selector CSS
 * @param {HTMLElement} parent - Elemento padre
 * @returns {NodeList}
 */
export const qsa = (selector, parent = document) => {
    return parent.querySelectorAll(selector);
};

/**
 * Agregar event listener
 * @param {HTMLElement} element - Elemento objetivo
 * @param {string} event - Tipo de evento
 * @param {Function} handler - Manejador del evento
 * @param {Object} options - Opciones del evento
 */
export const on = (element, event, handler, options = {}) => {
    element.addEventListener(event, handler, options);
};

/**
 * Remover event listener
 * @param {HTMLElement} element - Elemento objetivo
 * @param {string} event - Tipo de evento
 * @param {Function} handler - Manejador del evento
 * @param {Object} options - Opciones del evento
 */
export const off = (element, event, handler, options = {}) => {
    element.removeEventListener(event, handler, options);
};

/**
 * Agregar clase CSS
 * @param {HTMLElement} element - Elemento objetivo
 * @param {string} className - Nombre de la clase
 */
export const addClass = (element, className) => {
    element.classList.add(className);
};

/**
 * Remover clase CSS
 * @param {HTMLElement} element - Elemento objetivo
 * @param {string} className - Nombre de la clase
 */
export const removeClass = (element, className) => {
    element.classList.remove(className);
};

/**
 * Toggle clase CSS
 * @param {HTMLElement} element - Elemento objetivo
 * @param {string} className - Nombre de la clase
 */
export const toggleClass = (element, className) => {
    element.classList.toggle(className);
};

/**
 * Verificar si elemento tiene clase
 * @param {HTMLElement} element - Elemento objetivo
 * @param {string} className - Nombre de la clase
 * @returns {boolean}
 */
export const hasClass = (element, className) => {
    return element.classList.contains(className);
};

/**
 * Crear elemento HTML
 * @param {string} tag - Tag HTML
 * @param {Object} attributes - Atributos del elemento
 * @param {string} textContent - Contenido de texto
 * @returns {HTMLElement}
 */
export const createElement = (tag, attributes = {}, textContent = '') => {
    const element = document.createElement(tag);

    // Agregar atributos
    Object.entries(attributes).forEach(([key, value]) => {
        if (key === 'className') {
            element.className = value;
        } else if (key === 'textContent') {
            element.textContent = value;
        } else {
            element.setAttribute(key, value);
        }
    });

    // Agregar contenido de texto
    if (textContent) {
        element.textContent = textContent;
    }

    return element;
};

/**
 * Crear elemento con HTML interno
 * @param {string} html - HTML a insertar
 * @returns {HTMLElement}
 */
export const createElementFromHTML = (html) => {
    const template = document.createElement('template');
    template.innerHTML = html.trim();
    return template.content.firstElementChild;
};

/**
 * Mostrar elemento
 * @param {HTMLElement} element - Elemento objetivo
 */
export const show = (element) => {
    element.style.display = '';
    removeClass(element, 'is-hidden');
};

/**
 * Ocultar elemento
 * @param {HTMLElement} element - Elemento objetivo
 */
export const hide = (element) => {
    element.style.display = 'none';
    addClass(element, 'is-hidden');
};

/**
 * Toggle visibilidad de elemento
 * @param {HTMLElement} element - Elemento objetivo
 */
export const toggleVisibility = (element) => {
    if (element.style.display === 'none' || hasClass(element, 'is-hidden')) {
        show(element);
    } else {
        hide(element);
    }
};

/**
 * Agregar atributos de accesibilidad
 * @param {HTMLElement} element - Elemento objetivo
 * @param {Object} attributes - Atributos de accesibilidad
 */
export const addAccessibilityAttributes = (element, attributes) => {
    Object.entries(attributes).forEach(([key, value]) => {
        element.setAttribute(key, value);
    });
};

/**
 * Crear toast de notificación
 * @param {string} message - Mensaje a mostrar
 * @param {string} type - Tipo de toast (success, warning, danger, info)
 * @param {number} duration - Duración en milisegundos
 */
export const showToast = (message, type = 'info', duration = 5000) => {
    const toastContainer = qs('.toast-container') || createToastContainer();

    const toast = createElement('div', {
        className: `toast align-items-center text-white bg-${type} border-0`,
        role: 'alert',
        'aria-live': 'assertive',
        'aria-atomic': 'true'
    });

    toast.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">
                ${message}
            </div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
    `;

    toastContainer.appendChild(toast);

    // Inicializar toast de Bootstrap
    const bsToast = new bootstrap.Toast(toast, {
        autohide: true,
        delay: duration
    });

    bsToast.show();

    // Remover del DOM después de ocultarse
    toast.addEventListener('hidden.bs.toast', () => {
        toast.remove();
    });
};

/**
 * Crear contenedor de toasts si no existe
 * @returns {HTMLElement}
 */
const createToastContainer = () => {
    const container = createElement('div', {
        className: 'toast-container position-fixed top-0 end-0 p-3',
        style: 'z-index: 1055;'
    });

    document.body.appendChild(container);
    return container;
};

/**
 * Formatear fecha
 * @param {Date|string} date - Fecha a formatear
 * @param {string} locale - Locale para formateo
 * @returns {string}
 */
export const formatDate = (date, locale = 'es-ES') => {
    const dateObj = new Date(date);
    return dateObj.toLocaleDateString(locale, {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};

/**
 * Formatear fecha y hora
 * @param {Date|string} date - Fecha a formatear
 * @param {string} locale - Locale para formateo
 * @returns {string}
 */
export const formatDateTime = (date, locale = 'es-ES') => {
    const dateObj = new Date(date);
    return dateObj.toLocaleString(locale, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

/**
 * Formatear número con separadores de miles
 * @param {number} number - Número a formatear
 * @param {number} decimals - Decimales a mostrar
 * @returns {string}
 */
export const formatNumber = (number, decimals = 2) => {
    return new Intl.NumberFormat('es-ES', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
    }).format(number);
};
