/**
 * Sistema de autenticación para SIGPA Demo
 */
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
    signOut,
    updateProfile
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import { doc, setDoc, getDoc, updateDoc } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
import { auth, db } from './firebase.app.js';

// Proveedor de Google
const googleProvider = new GoogleAuthProvider();

/**
 * Registro de usuario con email y contraseña
 * @param {string} email - Email del usuario
 * @param {string} password - Contraseña del usuario
 * @param {string} displayName - Nombre para mostrar
 * @returns {Promise<Object>} Usuario creado
 */
export const emailRegister = async (email, password, displayName) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Actualizar perfil con displayName
        await updateProfile(user, { displayName });

        // Crear documento de usuario en Firestore
        await upsertUserProfile(user);

        return { success: true, user };
    } catch (error) {
        console.error('Error en registro:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Inicio de sesión con email y contraseña
 * @param {string} email - Email del usuario
 * @param {string} password - Contraseña del usuario
 * @returns {Promise<Object>} Resultado del login
 */
export const emailLogin = async (email, password) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Actualizar perfil en Firestore
        await upsertUserProfile(user);

        return { success: true, user };
    } catch (error) {
        console.error('Error en login:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Inicio de sesión con Google
 * @returns {Promise<Object>} Resultado del login
 */
export const googleLogin = async () => {
    try {
        const userCredential = await signInWithPopup(auth, googleProvider);
        const user = userCredential.user;

        // Actualizar perfil en Firestore
        await upsertUserProfile(user);

        return { success: true, user };
    } catch (error) {
        console.error('Error en login con Google:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Cerrar sesión
 * @returns {Promise<void>}
 */
export const logout = async () => {
    try {
        await signOut(auth);
        return { success: true };
    } catch (error) {
        console.error('Error en logout:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Crear o actualizar perfil de usuario en Firestore
 * @param {Object} user - Usuario de Firebase Auth
 * @returns {Promise<void>}
 */
const upsertUserProfile = async (user) => {
    try {
        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);

        const userData = {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName || '',
            photoURL: user.photoURL || '',
            providerIds: user.providerData.map(provider => provider.providerId),
            updatedAt: new Date(),
            lastLoginAt: new Date()
        };

        if (!userSnap.exists()) {
            // Usuario nuevo
            userData.createdAt = new Date();
            await setDoc(userRef, userData);
        } else {
            // Usuario existente, actualizar solo campos necesarios
            const updateData = {
                displayName: user.displayName || userSnap.data().displayName || '',
                photoURL: user.photoURL || userSnap.data().photoURL || '',
                providerIds: user.providerData.map(provider => provider.providerId),
                updatedAt: new Date(),
                lastLoginAt: new Date()
            };

            await updateDoc(userRef, updateData);
        }

        // Verificar que la operación fue exitosa
        const finalSnap = await getDoc(userRef);

    } catch (error) {
        console.error('❌ Error en upsertUserProfile:', error);
        throw error; // Re-lanzar el error para manejarlo en el nivel superior
    }
};

/**
 * Obtener perfil de usuario desde Firestore
 * @param {string} uid - ID del usuario
 * @returns {Promise<Object|null>} Perfil del usuario
 */
export const getUserProfile = async (uid) => {
    try {
        const userRef = doc(db, 'users', uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
            return userSnap.data();
        }
        return null;
    } catch (error) {
        console.error('Error al obtener perfil:', error);
        return null;
    }
};

/**
 * Actualizar perfil de usuario
 * @param {string} uid - ID del usuario
 * @param {Object} updates - Campos a actualizar
 * @returns {Promise<Object>} Resultado de la actualización
 */
export const updateUserProfile = async (uid, updates) => {
    try {
        const userRef = doc(db, 'users', uid);

        // Primero verificar si el documento existe
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
            console.warn('⚠️ Documento de usuario no existe, creando uno nuevo');
            // Crear documento completo si no existe
            const userData = {
                uid: uid,
                email: auth.currentUser?.email || '',
                displayName: updates.displayName || '',
                photoURL: updates.photoURL || '',
                providerIds: auth.currentUser?.providerData?.map(provider => provider.providerId) || [],
                createdAt: new Date(),
                updatedAt: new Date(),
                lastLoginAt: new Date()
            };

            await setDoc(userRef, userData);
        } else {
            // Actualizar solo los campos especificados
            const updateData = {
                ...updates,
                updatedAt: new Date()
            };

            // Asegurar que photoURL se actualice correctamente
            if (updates.photoURL !== undefined) {
                updateData.photoURL = updates.photoURL || '';
            }

            await updateDoc(userRef, updateData);
        }

        return { success: true };
    } catch (error) {
        console.error('❌ Error al actualizar perfil:', error);
        return { success: false, error: error.message };
    }
};

// Inicializar sistema de autenticación cuando se carga el módulo
document.addEventListener('DOMContentLoaded', () => {
    initializeAuthUI();
});

/**
 * Inicializar interfaz de autenticación
 */
const initializeAuthUI = () => {
    const authForm = document.getElementById('authForm');
    const googleBtn = document.getElementById('googleBtn');
    const authTabs = document.querySelectorAll('.c-auth__tab');
    const submitText = document.getElementById('submitText');
    const submitSpinner = document.getElementById('submitSpinner');
    const authError = document.getElementById('authError');

    if (!authForm) return;

    let currentTab = 'login';

    // Cambio de tabs
    authTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabType = tab.dataset.tab;
            currentTab = tabType;

            // Actualizar tabs activos
            authTabs.forEach(t => t.classList.remove('c-auth__tab--active'));
            tab.classList.add('c-auth__tab--active');

            // Actualizar texto del botón
            submitText.textContent = tabType === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta';

            // Limpiar errores
            hideError();
        });
    });

    // Formulario de autenticación
    authForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        if (!email || !password) {
            showError('Por favor completa todos los campos');
            return;
        }

        showLoading(true);
        hideError();

        let result;
        if (currentTab === 'login') {
            result = await emailLogin(email, password);
        } else {
            result = await emailRegister(email, password, email.split('@')[0]);
        }

        showLoading(false);

        if (result.success) {
            // Redirigir al dashboard
            window.location.href = './dashboard.html';
        } else {
            showError(result.error);
        }
    });

    // Botón de Google
    if (googleBtn) {
        googleBtn.addEventListener('click', async () => {
            showLoading(true);
            hideError();

            const result = await googleLogin();

            showLoading(false);

            if (result.success) {
                window.location.href = './dashboard.html';
            } else {
                showError(result.error);
            }
        });
    }

    /**
     * Mostrar estado de carga
     */
    const showLoading = (loading) => {
        if (submitText && submitSpinner) {
            submitText.style.display = loading ? 'none' : 'inline';
            submitSpinner.style.display = loading ? 'inline-block' : 'none';
        }
    };

    /**
     * Mostrar error
     */
    const showError = (message) => {
        if (authError) {
            authError.textContent = message;
            authError.style.display = 'block';
        }
    };

    /**
     * Ocultar error
     */
    const hideError = () => {
        if (authError) {
            authError.style.display = 'none';
        }
    };
};
