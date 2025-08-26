/**
 * Inicialización de Firebase para SIGPA Demo
 */
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getAuth, setPersistence, browserLocalPersistence } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
import { firebaseConfig } from './firebase.config.js';

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Obtener instancias de Auth y Firestore
const auth = getAuth(app);
const db = getFirestore(app);

// Configurar persistencia de autenticación
setPersistence(auth, browserLocalPersistence);

// Exportar instancias
export { auth, db };

// Hacer disponibles globalmente para compatibilidad
if (typeof window !== 'undefined') {
    window.firebaseAuth = auth;
    window.firebaseDb = db;
}
