/**
 * Módulo Perfil para SIGPA Demo
 * Edición de información del usuario autenticado
 */
import { auth } from '../../core/firebase.app.js';
import { updateUserProfile, getUserProfile } from '../../core/auth.js';
import { showToast } from '../../core/ui.js';

/**
 * Montar el módulo Perfil
 * @param {HTMLElement} rootEl - Elemento raíz donde montar el módulo
 * @returns {Object} Objeto con función unmount
 */
export const mount = async (rootEl) => {
    try {
        console.log('🚀 Montando módulo de perfil...');

        // Verificar que Firebase esté disponible
        if (!auth || !auth.currentUser) {
            throw new Error('Firebase no está disponible o usuario no autenticado');
        }

        // Obtener usuario actual
        const user = auth.currentUser;
        if (!user) {
            throw new Error('Usuario no autenticado');
        }

        console.log('👤 Usuario autenticado:', user.uid, user.displayName, user.email);
        console.log('🔧 Firebase Auth disponible:', !!auth);
        console.log('🔧 updateUserProfile disponible:', !!updateUserProfile);
        console.log('🔧 getUserProfile disponible:', !!getUserProfile);

        // Obtener perfil desde Firestore
        const profile = await getUserProfile(user.uid);
        console.log('📊 Perfil cargado desde Firestore:', profile);

        // Renderizar contenido
        rootEl.innerHTML = renderPerfil(user, profile);

        // Event listeners
        initializeEventListeners(rootEl, user);

        return {
            unmount: () => {
                // Limpiar event listeners
                console.log('🔄 Desmontando módulo de perfil');
            }
        };
    } catch (error) {
        console.error('❌ Error al montar módulo Perfil:', error);
        rootEl.innerHTML = renderError();
        return { unmount: () => {} };
    }
};

/**
 * Renderizar contenido del módulo Perfil
 * @param {Object} user - Usuario de Firebase Auth
 * @param {Object} profile - Perfil del usuario desde Firestore
 * @returns {string} HTML del módulo
 */
const renderPerfil = (user, profile) => {
    const displayName = profile?.displayName || user.displayName || '';
    const photoURL = profile?.photoURL || user.photoURL || '';

    // Función para mostrar el proveedor de manera amigable
    const getProviderDisplayName = (providerId) => {
        const providerNames = {
            'password': 'Registro Tradicional',
            'google.com': 'Google',
            'facebook.com': 'Facebook',
            'twitter.com': 'Twitter',
            'github.com': 'GitHub'
        };
        return providerNames[providerId] || providerId;
    };

    return `
        <div class="container-fluid">
            <div class="row mb-4">
                <div class="col-12">
                    <h1 class="h2 mb-3">
                        <i class="bi bi-person text-primary me-2"></i>
                        Mi Perfil
                    </h1>
                    <p class="text-muted">Gestiona tu información personal y preferencias</p>
                </div>
            </div>

            <div class="row">
                <div class="col-lg-8 mx-auto">
                    <div class="card profile-card">
                        <div class="card-header">
                            <h5 class="card-title mb-0">
                                <i class="bi bi-person-circle text-info me-2"></i>
                                Información Personal
                            </h5>
                        </div>
                        <div class="card-body">
                            <form id="profileForm" class="profile-form">
                                <div class="row mb-3">
                                    <div class="col-lg-6 col-md-12 mb-3">
                                        <label for="displayName" class="form-label">Nombre para mostrar</label>
                                        <input type="text" class="form-control" id="displayName" name="displayName"
                                               value="${displayName}" required>
                                        <div class="form-text">Este nombre se mostrará en la aplicación</div>
                                    </div>
                                    <div class="col-lg-6 col-md-12 mb-3">
                                        <label for="email" class="form-label">Email</label>
                                        <div class="form-control-plaintext" id="email">
                                            ${user.email}
                                        </div>
                                        <div class="form-text">El email no se puede modificar</div>
                                    </div>
                                </div>

                                <div class="row mb-3">
                                    <div class="col-lg-6 col-md-12 mb-3">
                                        <label for="photoURL" class="form-label">URL de foto de perfil</label>
                                        <input type="url" class="form-control" id="photoURL" name="photoURL"
                                               value="${photoURL}" placeholder="https://ejemplo.com/foto.jpg">
                                        <div class="form-text">URL opcional de tu foto de perfil</div>
                                    </div>
                                    <div class="col-lg-6 col-md-12 mb-3">
                                        <label class="form-label">Vista previa</label>
                                        <div class="d-flex align-items-center">
                                            <div class="avatar-preview me-3" id="avatarPreview">
                                                ${photoURL ?
                                                    `<img src="${photoURL}" alt="Avatar" style="width: 100%; height: 100%; object-fit: cover;">` :
                                                    getDefaultAvatarSVG()
                                                }
                                            </div>
                                            <div>
                                                <small class="text-muted">Tu avatar actual</small>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div class="row mb-3">
                                    <div class="col-12">
                                        <label class="form-label">Información del sistema</label>
                                        <div class="row">
                                            <div class="col-lg-6 col-md-12 mb-2">
                                                <small class="text-muted">
                                                    <strong>ID de usuario:</strong><br>
                                                    <code class="info-code d-block text-break">${user.uid}</code>
                                                </small>
                                            </div>
                                            <div class="col-lg-6 col-md-12 mb-2">
                                                <small class="text-muted">
                                                    <strong>Proveedor:</strong><br>
                                                    <span class="info-badge">${getProviderDisplayName(user.providerData[0]?.providerId || 'password')}</span>
                                                </small>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <hr>

                                <div class="d-flex justify-content-between align-items-center">
                                    <div>
                                        <button type="button" class="btn btn-secondary profile-btn" id="cancelBtn">
                                            <i class="bi bi-arrow-left"></i>
                                            Volver
                                        </button>
                                    </div>
                                    <button type="submit" class="btn btn-primary profile-btn" id="saveBtn">
                                        <i class="bi bi-check-lg"></i>
                                        Guardar Cambios
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Información adicional -->
            <div class="row mt-4">
                <div class="col-lg-8 mx-auto">
                    <div class="card profile-card security-section">
                        <div class="card-header">
                            <h5 class="card-title mb-0">
                                <i class="bi bi-shield-check text-success me-2"></i>
                                Seguridad y Privacidad
                            </h5>
                        </div>
                        <div class="card-body">
                            <div class="row">
                                <div class="col-lg-6 col-md-12 mb-3">
                                    <h6>Autenticación</h6>
                                    <ul class="list-unstyled">
                                        <li><i class="bi bi-check-circle text-success me-2"></i>Email verificado</li>
                                        <li><i class="bi bi-check-circle text-success me-2"></i>Inicio de sesión seguro</li>
                                        <li><i class="bi bi-check-circle text-success me-2"></i>Persistencia local</li>
                                    </ul>
                                </div>
                                <div class="col-lg-6 col-md-12 mb-3">
                                    <h6>Datos</h6>
                                    <ul class="list-unstyled">
                                        <li><i class="bi bi-check-circle text-success me-2"></i>Almacenamiento seguro</li>
                                        <li><i class="bi bi-check-circle text-success me-2"></i>Acceso restringido</li>
                                        <li><i class="bi bi-check-circle text-success me-2"></i>Encriptación</li>
                                    </ul>
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
 * Inicializar event listeners
 * @param {HTMLElement} rootEl - Elemento raíz
 * @param {Object} user - Usuario de Firebase Auth
 */
const initializeEventListeners = (rootEl, user) => {
    const profileForm = rootEl.querySelector('#profileForm');
    const cancelBtn = rootEl.querySelector('#cancelBtn');
    const photoURLInput = rootEl.querySelector('#photoURL');

    // Formulario de perfil
    if (profileForm) {
        console.log('📝 Formulario encontrado, agregando event listener');
        console.log('📝 Formulario HTML:', profileForm.outerHTML);
        console.log('📝 Botón submit encontrado:', profileForm.querySelector('button[type="submit"]'));

        // Agregar event listener para submit
        profileForm.addEventListener('submit', async (e) => {
            console.log('🎯 EVENT LISTENER EJECUTADO - Formulario enviado');
            e.preventDefault();
            console.log('📝 Formulario de perfil enviado');

            const formData = new FormData(profileForm);
            const updates = {
                displayName: formData.get('displayName'),
                photoURL: formData.get('photoURL')
            };

            console.log('🔄 Datos del formulario:', updates);
            console.log('👤 Usuario actual:', user);
            console.log('🆔 UID del usuario:', user.uid);

            // Validaciones
            if (!updates.displayName.trim()) {
                showToast('El nombre es obligatorio', 'warning');
                return;
            }

            console.log('✅ Validaciones pasadas, procediendo con actualización...');

            try {
                // Mostrar estado de carga
                const saveBtn = profileForm.querySelector('#saveBtn');
                const originalText = saveBtn.innerHTML;
                saveBtn.innerHTML = '<i class="spinner-border spinner-border-sm me-2"></i>Guardando...';
                saveBtn.disabled = true;

                console.log('💾 Llamando a updateUserProfile con:', { uid: user.uid, updates });

                // Actualizar perfil en Firestore
                const result = await updateUserProfile(user.uid, updates);
                console.log('📊 Resultado de updateUserProfile:', result);

                if (result.success) {
                    console.log('✅ Perfil actualizado en Firestore, actualizando Firebase Auth...');

                    // Actualizar también Firebase Auth
                    try {
                        const { updateProfile } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js');
                        await updateProfile(auth.currentUser, {
                            displayName: updates.displayName,
                            photoURL: updates.photoURL || null
                        });
                        console.log('✅ Perfil de Firebase Auth actualizado');
                    } catch (authError) {
                        console.warn('⚠️ No se pudo actualizar Firebase Auth:', authError);
                    }

                    showToast('Perfil actualizado correctamente', 'success');
                    console.log('✅ Perfil actualizado exitosamente');

                    // Actualizar vista previa de avatar
                    updateAvatarPreview(updates.photoURL);

                    // Actualizar información en el topbar si es posible
                    updateTopbarInfo(updates);

                    // Recargar la página para mostrar los cambios actualizados
                    setTimeout(() => {
                        window.location.reload();
                    }, 1500);

                } else {
                    console.error('❌ Error retornado por updateUserProfile:', result.error);
                    showToast(`Error al actualizar perfil: ${result.error}`, 'danger');
                }
            } catch (error) {
                console.error('❌ Excepción en actualización de perfil:', error);
                showToast(`Error al actualizar perfil: ${error.message}`, 'danger');
            } finally {
                // Restaurar botón
                const saveBtn = profileForm.querySelector('#saveBtn');
                if (saveBtn && originalText) {
                    saveBtn.innerHTML = originalText;
                    saveBtn.disabled = false;
                }
            }
        });
    } else {
        console.error('❌ No se encontró el formulario de perfil');
    }

    // Botón cancelar
    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
            // Navegar al módulo anterior o al home
            if (window.history.length > 1) {
                window.history.back();
            } else if (window.router) {
                window.router.navigate('/');
            } else {
                window.location.hash = '#/';
            }
        });
    }

    // Preview de avatar en tiempo real
    if (photoURLInput) {
        photoURLInput.addEventListener('input', (e) => {
            const url = e.target.value.trim();
            updateAvatarPreview(url);
        });
    }

    // Manejar errores de imagen en la vista previa inicial
    const initialAvatarImg = rootEl.querySelector('#avatarPreview img');
    if (initialAvatarImg) {
        initialAvatarImg.addEventListener('error', () => {
            const previewContainer = rootEl.querySelector('#avatarPreview');
            if (previewContainer) {
                previewContainer.innerHTML = getDefaultAvatarSVG();
            }
        });
    }

    // Event listener adicional para el botón de guardar (respaldo)
    const saveBtn = rootEl.querySelector('#saveBtn');
    if (saveBtn) {
        console.log('💾 Botón de guardar encontrado, agregando event listener adicional');
        saveBtn.addEventListener('click', async (e) => {
            console.log('🎯 CLICK EN BOTÓN GUARDAR - Event listener adicional ejecutado');
            e.preventDefault();

            // Test simple de la función updateUserProfile
            console.log('🧪 Probando función updateUserProfile...');
            try {
                const testResult = await updateUserProfile(user.uid, { displayName: 'TEST' });
                console.log('🧪 Resultado del test:', testResult);
            } catch (error) {
                console.error('🧪 Error en test:', error);
            }

            // Simular submit del formulario
            const profileForm = rootEl.querySelector('#profileForm');
            if (profileForm) {
                profileForm.dispatchEvent(new Event('submit', { bubbles: true }));
            }
        });
    }
};

/**
 * Actualizar vista previa del avatar
 * @param {string} photoURL - URL de la foto
 */
const updateAvatarPreview = (photoURL) => {
    const previewContainer = document.querySelector('#profileForm #avatarPreview');
    if (previewContainer) {
        if (photoURL && photoURL.trim()) {
            // Verificar que la imagen se carga correctamente
            const img = new Image();
            img.onload = () => {
                previewContainer.innerHTML = `<img src="${photoURL}" alt="Avatar" style="width: 100%; height: 100%; object-fit: cover;">`;
            };
            img.onerror = () => {
                previewContainer.innerHTML = getDefaultAvatarSVG();
                showToast('No se pudo cargar la imagen. Verifica que la URL sea válida.', 'warning');
            };
            img.src = photoURL;
        } else {
            previewContainer.innerHTML = getDefaultAvatarSVG();
        }
    }
};

/**
 * Actualizar información en el topbar
 * @param {Object} updates - Cambios realizados
 */
const updateTopbarInfo = (updates) => {
    console.log('🔄 Actualizando información del topbar:', updates);

    // Actualizar nombre en el topbar
    const profileName = document.getElementById('profileName');
    if (profileName && updates.displayName) {
        profileName.textContent = updates.displayName;
        console.log('✅ Nombre actualizado en topbar:', updates.displayName);
    }

    // Actualizar avatar en el topbar
    const profileAvatar = document.getElementById('profileAvatar');
    if (profileAvatar && updates.photoURL) {
        profileAvatar.src = updates.photoURL;
        profileAvatar.alt = updates.displayName || 'Usuario';
        console.log('✅ Avatar actualizado en topbar:', updates.photoURL);
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
                    <h2 class="mt-3">Error al cargar perfil</h2>
                    <p class="text-muted">No se pudo cargar la información del perfil</p>
                    <button class="btn btn-primary" onclick="location.reload()">
                        Recargar página
                    </button>
                </div>
            </div>
        </div>
    `;
};

/**
 * Obtener el SVG de avatar por defecto
 * @returns {string} SVG del avatar por defecto
 */
const getDefaultAvatarSVG = () => {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="currentColor" class="bi bi-person-circle" viewBox="0 0 16 16">
        <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"/>
        <path fill-rule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8ZM8 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"/>
    </svg>`;
};
