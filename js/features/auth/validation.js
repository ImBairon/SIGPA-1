import { validateEmail, validatePassword, getPasswordStrengthText, getPasswordSuggestions, translateSuggestion } from '../../core/validation.js';

class FormValidator {
    constructor() {
        this.emailInput = document.getElementById('email');
        this.passwordInput = document.getElementById('password');
        this.emailFeedback = document.getElementById('emailFeedback');
        this.passwordFeedback = document.getElementById('passwordFeedback');
        this.passwordStrength = document.getElementById('passwordStrength');
        this.strengthBar = document.getElementById('strengthBar');
        this.strengthText = document.getElementById('strengthText');
        this.strengthFeedback = document.getElementById('strengthFeedback');
        this.strengthSuggestions = document.getElementById('strengthSuggestions');
        this.authForm = document.getElementById('authForm');
        this.currentTab = 'login';

        this.initializeValidation();
    }

    initializeValidation() {
        // Event listeners para validación en tiempo real
        this.emailInput.addEventListener('input', () => this.validateEmailField());
        this.emailInput.addEventListener('blur', () => this.validateEmailField());

        this.passwordInput.addEventListener('input', () => this.validatePasswordField());
        this.passwordInput.addEventListener('blur', () => this.validatePasswordField());

        // Event listener para cambio de tabs
        document.addEventListener('tabChanged', (e) => {
            this.currentTab = e.detail.tab;
            this.updatePasswordStrengthVisibility();
        });

        // Event listener para envío del formulario
        this.authForm.addEventListener('submit', (e) => this.handleFormSubmit(e));

        // Inicializar toggle de contraseña
        this.initializePasswordToggle();

        // Inicializar estado
        this.updatePasswordStrengthVisibility();
    }

    initializePasswordToggle() {
        const passwordToggle = document.getElementById('passwordToggle');
        const passwordIcon = document.getElementById('passwordIcon');

        if (passwordToggle && passwordIcon) {
            passwordToggle.addEventListener('click', () => {
                const type = this.passwordInput.type === 'password' ? 'text' : 'password';
                this.passwordInput.type = type;

                // Cambiar icono
                if (type === 'text') {
                    passwordIcon.className = 'bi bi-eye-slash';
                    passwordToggle.setAttribute('aria-label', 'Ocultar contraseña');
                } else {
                    passwordIcon.className = 'bi bi-eye';
                    passwordToggle.setAttribute('aria-label', 'Mostrar contraseña');
                }

                // Mantener foco en el input
                this.passwordInput.focus();
            });

            // Event listener para tecla Enter en el toggle
            passwordToggle.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    passwordToggle.click();
                }
            });
        }
    }

    validateEmailField() {
        const email = this.emailInput.value.trim();
        const validation = validateEmail(email);

        this.updateFieldValidation(this.emailInput, this.emailFeedback, validation);

        return validation.isValid;
    }

    validatePasswordField() {
        const password = this.passwordInput.value;
        const isRegister = this.currentTab === 'register';
        const validation = validatePassword(password, isRegister);

        this.updateFieldValidation(this.passwordInput, this.passwordFeedback, validation);

        // Actualizar indicador de fortaleza si es registro
        if (isRegister && password.length > 0) {
            this.updatePasswordStrength(validation.strength);
        }

        return validation.isValid;
    }

    updateFieldValidation(input, feedbackElement, validation) {
        // Remover clases anteriores
        input.classList.remove('is-valid', 'is-invalid');
        feedbackElement.style.display = 'none';

        if (validation.isValid) {
            input.classList.add('is-valid');
            feedbackElement.textContent = '';
        } else {
            input.classList.add('is-invalid');
            feedbackElement.textContent = validation.error;
            feedbackElement.style.display = 'block';
        }
    }

    updatePasswordStrength(strength) {
        if (!strength) return;

        const { score, feedback, crackTime } = strength;
        const strengthInfo = getPasswordStrengthText(score);

        // Actualizar barra de progreso
        this.strengthBar.style.width = `${(score + 1) * 20}%`;
        this.strengthBar.setAttribute('data-strength', score);

        // Actualizar texto de fortaleza
        this.strengthText.textContent = strengthInfo.text;
        this.strengthText.className = `fw-bold ${strengthInfo.class}`;

        // Actualizar feedback principal (asegurar que esté en español)
        if (feedback && feedback.trim() !== '') {
            // Asegurar que el feedback esté traducido
            const translatedFeedback = translateSuggestion(feedback);
            this.strengthFeedback.textContent = translatedFeedback;
        } else {
            // Traducir el tiempo de crackeo
            const timeTranslation = this.translateCrackTime(crackTime);
            this.strengthFeedback.textContent = `Tiempo estimado para crackear: ${timeTranslation}`;
        }

        // Actualizar sugerencias (solo si hay feedback principal)
        if (feedback && feedback.trim() !== '') {
            this.strengthSuggestions.innerHTML = '';
        } else {
            // Solo mostrar sugerencias si no hay feedback principal
            const suggestions = getPasswordSuggestions(this.passwordInput.value);
            if (suggestions.length > 0) {
                this.strengthSuggestions.innerHTML = suggestions.map(suggestion =>
                    `<div class="text-warning">💡 ${suggestion}</div>`
                ).join('');
            } else {
                this.strengthSuggestions.innerHTML = '';
            }
        }

        // Mostrar indicador de fortaleza
        this.passwordStrength.style.display = 'block';
    }

    // Función auxiliar para traducir tiempos de crackeo
    translateCrackTime(crackTime) {
        const timeTranslations = {
            'instant': 'instantáneo',
            'seconds': 'segundos',
            'minutes': 'minutos',
            'hours': 'horas',
            'days': 'días',
            'months': 'meses',
            'years': 'años',
            'centuries': 'siglos'
        };

        return timeTranslations[crackTime] || crackTime;
    }

    updatePasswordStrengthVisibility() {
        if (this.currentTab === 'register') {
            this.passwordStrength.style.display = 'block';
            // Validar contraseña actual si existe
            if (this.passwordInput.value.length > 0) {
                this.validatePasswordField();
            }
        } else {
            this.passwordStrength.style.display = 'none';
        }
    }

    handleFormSubmit(e) {
        e.preventDefault();

        // Validar ambos campos
        const isEmailValid = this.validateEmailField();
        const isPasswordValid = this.validatePasswordField();

        if (isEmailValid && isPasswordValid) {
            // Formulario válido, proceder con el envío
            this.submitForm();
        } else {
            // Mostrar error general
            this.showGeneralError('Por favor, corrige los errores en el formulario.');
        }
    }

    submitForm() {
        const formData = {
            email: this.emailInput.value.trim(),
            password: this.passwordInput.value,
            action: this.currentTab
        };

        // Aquí puedes implementar la lógica de envío
        console.log('Formulario válido:', formData);

        // Simular envío (reemplazar con tu lógica real)
        this.showLoadingState(true);

        setTimeout(() => {
            this.showLoadingState(false);
            if (this.currentTab === 'login') {
                this.showSuccessMessage('¡Inicio de sesión exitoso!');
            } else {
                this.showSuccessMessage('¡Cuenta creada exitosamente!');
            }
        }, 2000);
    }

    showLoadingState(loading) {
        const submitBtn = this.authForm.querySelector('button[type="submit"]');
        const submitText = document.getElementById('submitText');
        const submitSpinner = document.getElementById('submitSpinner');

        if (loading) {
            submitBtn.disabled = true;
            submitText.textContent = this.currentTab === 'login' ? 'Iniciando...' : 'Creando...';
            submitSpinner.style.display = 'inline-block';
        } else {
            submitBtn.disabled = false;
            submitText.textContent = this.currentTab === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta';
            submitSpinner.style.display = 'none';
        }
    }

    showGeneralError(message) {
        const authError = document.getElementById('authError');
        authError.textContent = message;
        authError.style.display = 'block';

        // Ocultar error después de 5 segundos
        setTimeout(() => {
            authError.style.display = 'none';
        }, 5000);
    }

    showSuccessMessage(message) {
        const authError = document.getElementById('authError');
        authError.textContent = message;
        authError.className = 'c-auth__error c-auth__error--success';
        authError.style.display = 'block';

        // Ocultar mensaje después de 3 segundos
        setTimeout(() => {
            authError.style.display = 'none';
        }, 3000);
    }

    // Método público para resetear validaciones
    resetValidation() {
        this.emailInput.classList.remove('is-valid', 'is-invalid');
        this.passwordInput.classList.remove('is-valid', 'is-invalid');
        this.emailFeedback.style.display = 'none';
        this.passwordFeedback.style.display = 'none';
        this.passwordStrength.style.display = 'none';
    }
}

// Exportar la clase para uso externo
export default FormValidator;
