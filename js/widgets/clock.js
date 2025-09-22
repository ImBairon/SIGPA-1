/**
 * Widget de reloj para SIGPA Demo
 * Muestra la hora actual y se actualiza cada minuto
 */

/**
 * Clase Clock para manejar el reloj
 */
class Clock {
    constructor() {
        this.interval = null;
        this.displayElement = null;
        this.isRunning = false;
    }

    /**
     * Iniciar el reloj
     * @param {string} selector - Selector del elemento donde mostrar la hora
     */
    start(selector = '#clockDisplay') {
        if (this.isRunning) return;

        this.displayElement = document.querySelector(selector);
        if (!this.displayElement) {
            console.warn('Elemento de reloj no encontrado:', selector);
            return;
        }

        // Mostrar hora inmediatamente
        this.updateTime();

        // Actualizar cada minuto (60000 ms)
        this.interval = setInterval(() => {
            this.updateTime();
        }, 60000);

        this.isRunning = true;
    }

    /**
     * Detener el reloj
     */
    stop() {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
        this.isRunning = false;
    }

    /**
     * Actualizar la hora mostrada
     */
    updateTime() {
        if (!this.displayElement) return;

        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');

        this.displayElement.textContent = `${hours}:${minutes}`;

        // Actualizar atributo title para mostrar hora completa
        this.displayElement.title = now.toLocaleTimeString('es-ES', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    }

    /**
     * Obtener hora actual formateada
     * @returns {string} Hora en formato HH:MM
     */
    getCurrentTime() {
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    }

    /**
     * Obtener hora actual completa
     * @returns {string} Hora completa formateada
     */
    getCurrentTimeFull() {
        const now = new Date();
        return now.toLocaleTimeString('es-ES', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    }

    /**
     * Verificar si el reloj está funcionando
     * @returns {boolean}
     */
    isActive() {
        return this.isRunning;
    }
}

// Crear instancia global del reloj
const clock = new Clock();

// Hacer disponible globalmente
window.clock = clock;

// Exportar para uso en otros módulos
export { clock, Clock };
