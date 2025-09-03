import { z } from 'https://cdn.jsdelivr.net/npm/zod@4.1.1/+esm';

// Usar variable global para zxcvbn
const zxcvbn = window.zxcvbn;

// Verificar que zxcvbn esté disponible
if (!zxcvbn) {
    console.error('zxcvbn no está disponible. Verifica que el CDN esté cargado.');
    // Fallback: crear función dummy para evitar errores
    window.zxcvbn = () => ({
        score: 0,
        feedback: { warning: '', suggestions: [] },
        crack_times_display: { offline_slow_hashing_1M_per_second: 'instant' }
    });
}

// Validación nativa de email (más simple y eficiente)
const validateEmailNative = (email) => {
    if (!email || email.trim() === '') {
        return { isValid: false, error: 'El email es requerido' };
    }

    if (email.length > 255) {
        return { isValid: false, error: 'El email es demasiado largo' };
    }

    // Regex simple pero eBectivo
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
        return { isValid: false, error: 'Formato de email inválido' };
    }

    return { isValid: true, error: null };
};

// Función auxiliar para obtener tiempo de crackeo con fallback
const getCrackTime = (result) => {
    try {
        if (result.crack_times_display && result.crack_times_display.offline_slow_hashing_1M_per_second) {
            return result.crack_times_display.offline_slow_hashing_1M_per_second;
        }

        // Fallback basado en el score
        const fallbackTimes = {
            0: 'instant',
            1: 'seconds',
            2: 'minutes',
            3: 'hours',
            4: 'years'
        };

        return fallbackTimes[result.score] || 'instant';
    } catch (error) {
        return 'instant';
    }
};

// Validación nativa de contraseña
const validatePasswordNative = (password, isRegister = false) => {
    if (!password || password === '') {
        return { isValid: false, error: 'La contraseña es requerida', strength: null };
    }

    if (password.length < 8) {
        return { isValid: false, error: 'La contraseña debe tener al menos 8 caracteres', strength: null };
    }

    // Siempre usar zxcvbn para obtener información de fortaleza
    const result = zxcvbn(password);

    // Solo usar zxcvbn si es registro y la contraseña cumple requisitos básicos
    if (isRegister) {
        // Mínimo score 2 (débil pero aceptable)
        if (result.score < 2) {
            return {
                isValid: false,
                error: 'La contraseña es demasiado débil',
                strength: {
                    score: result.score,
                    feedback: translateSuggestion(result.feedback.warning || result.feedback.suggestions[0] || ''),
                    crackTime: getCrackTime(result)
                }
            };
        }
    }

    // Retornar siempre la información de fortaleza
    return {
        isValid: true,
        error: null,
        strength: {
            score: result.score,
            feedback: translateSuggestion(result.feedback.warning || result.feedback.suggestions[0] || ''),
            crackTime: getCrackTime(result)
        }
    };
};

// Esquemas de Zod para estructura del formulario (sin validaciones complejas)
export const loginSchema = z.object({
    email: z.string(),
    password: z.string()
});

export const registerSchema = z.object({
    email: z.string(),
    password: z.string()
});

// Funciones de validación que usan validación nativa
export const validateEmail = (email) => {
    return validateEmailNative(email);
};

export const validatePassword = (password, isRegister = false) => {
    return validatePasswordNative(password, isRegister);
};

// Función para obtener el texto de fortaleza de contraseña
export const getPasswordStrengthText = (score) => {
    const strengthMap = {
        0: { text: 'Muy Débil', color: 'danger', class: 'text-danger' },
        1: { text: 'Débil', color: 'warning', class: 'text-warning' },
        2: { text: 'Aceptable', color: 'info', class: 'text-info' },
        3: { text: 'Buena', color: 'success', class: 'text-success' },
        4: { text: 'Excelente', color: 'success', class: 'text-success' }
    };

    return strengthMap[score] || strengthMap[0];
};

// Función para traducir sugerencias de zxcvbn al español
export const translateSuggestion = (englishSuggestion) => {
    const translations = {
        'Add another word or two. Uncommon words are better.': 'Agrega otra palabra o dos. Las palabras poco comunes son mejores.',
        'Use a longer keyboard pattern with more turns': 'Usa un patrón de teclado más largo con más giros',
        'Avoid repeated words and characters': 'Evita palabras y caracteres repetidos',
        'Avoid sequences': 'Evita secuencias',
        'Avoid recent years': 'Evita años recientes',
        'Avoid years that are associated with you': 'Evita años asociados contigo',
        'Avoid dates and years that are associated with you': 'Evita fechas y años asociados contigo',
        'Capitalization doesn\'t help very much': 'Las mayúsculas no ayudan mucho',
        'All-uppercase is almost as easy to crack as all-lowercase': 'Todo en mayúsculas es casi tan fácil de crackear como todo en minúsculas',
        'Reversed words aren\'t much harder to guess': 'Las palabras invertidas no son mucho más difíciles de adivinar',
        'Predictable substitutions like \'@\' instead of \'a\' don\'t help very much': 'Sustituciones predecibles como \'@\' en lugar de \'a\' no ayudan mucho',
        'Use a few words, avoid common phrases': 'Usa algunas palabras, evita frases comunes',
        'No need for symbols, digits, or uppercase letters': 'No es necesario usar símbolos, dígitos o letras mayúsculas',
        'This is a top-10 common password': 'Esta es una de las 10 contraseñas más comunes',
        'This is a top-100 common password': 'Esta es una de las 100 contraseñas más comunes',
        'This is a very common password': 'Esta es una contraseña muy común',
        'This is similar to a commonly used password': 'Esto es similar a una contraseña comúnmente usada',
        'A word by itself is easy to guess': 'Una palabra por sí sola es fácil de adivinar',
        'Names and surnames by themselves are easy to guess': 'Los nombres y apellidos por sí solos son fáciles de adivinar',
        'Common names and surnames are easy to guess': 'Los nombres y apellidos comunes son fáciles de adivinar',
        // Mensajes adicionales que pueden aparecer
        'Straight rows of keys are easy to guess': 'Las filas rectas de teclas son fáciles de adivinar',
        'Short keyboard patterns are easy to guess': 'Los patrones cortos de teclado son fáciles de adivinar',
        'Use a longer keyboard pattern with more turns': 'Usa un patrón de teclado más largo con más giros',
        'Repeated characters are easy to guess': 'Los caracteres repetidos son fáciles de adivinar',
        'Repeated patterns are easy to guess': 'Los patrones repetidos son fáciles de adivinar',
        'Dictionary words are easy to guess': 'Las palabras del diccionario son fáciles de adivinar',
        'Add another word or two': 'Agrega otra palabra o dos',
        'Uncommon words are better': 'Las palabras poco comunes son mejores',
        'Use a few words': 'Usa algunas palabras',
        'Avoid common phrases': 'Evita frases comunes',
        'Avoid personal information': 'Evita información personal',
        'Avoid predictable patterns': 'Evita patrones predecibles'
    };

    return translations[englishSuggestion] || englishSuggestion;
};

// Función para obtener sugerencias de mejora de contraseña (sin duplicados)
export const getPasswordSuggestions = (password) => {
    const result = zxcvbn(password);
    const suggestions = result.feedback.suggestions || [];

    // Eliminar duplicados y traducir
    const uniqueSuggestions = [...new Set(suggestions)];
    return uniqueSuggestions.map(translateSuggestion);
};
