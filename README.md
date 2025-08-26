# SIGPA Demo

Sistema de Gestión de Producción Agrícola - Proyecto DEMO para GitHub Pages

## 🚀 Características

- **Autenticación completa** con Firebase Auth (Email/Password + Google)
- **Dashboard responsive** con sidebar colapsable y topbar
- **Router basado en hash** para navegación sin recargas
- **Sistema de temas** (claro/oscuro/sistema) con persistencia
- **Módulos funcionales** con datos JSON de ejemplo
- **Accesibilidad completa** con ARIA y navegación por teclado
- **Integración Firebase** v10 por CDN (Auth + Firestore)
- **Bootstrap 5.3** para UI moderna y responsive
- **Chart.js 4.x** para gráficos interactivos

## 📁 Estructura del Proyecto

```
SIGPA-DEMO/
├── index.html                 # Login / Registro
├── dashboard.html             # App post-login
├── partials/                  # Componentes HTML reutilizables
│   ├── sidebar.html          # Navegación lateral
│   └── topbar.html           # Barra superior
├── data/                      # Datos JSON del demo
│   ├── home.json             # Dashboard principal
│   ├── riego.json            # Módulo de riego
│   ├── calendario.json       # Calendario de actividades
│   ├── alertas.json          # Sistema de alertas
│   ├── crecimiento.json      # Métricas de crecimiento
│   ├── clima.json            # Datos climáticos (placeholder)
│   └── mis-cultivos.json     # Gestión de cultivos
├── css/                       # Estilos CSS
│   ├── base.css              # Reset y utilidades
│   ├── theme.css             # Variables y temas
│   └── layout.css            # Layout y componentes
├── js/                        # JavaScript ES6+
│   ├── core/                 # Funcionalidades principales
│   │   ├── firebase.config.js # Configuración Firebase
│   │   ├── firebase.app.js   # Inicialización Firebase
│   │   ├── auth.js           # Sistema de autenticación
│   │   ├── guard.js          # Protección de rutas
│   │   ├── router-hash.js    # Router basado en hash
│   │   ├── theme.js          # Gestión de temas
│   │   ├── storage.js        # Helpers localStorage
│   │   ├── ui.js             # Utilidades UI
│   │   └── json.repository.js # Repositorio de datos
│   ├── widgets/              # Componentes reutilizables
│   │   └── clock.js          # Widget de reloj
│   └── features/             # Módulos de la aplicación
│       ├── home/             # Dashboard principal
│       ├── riego/            # Gestión de riego
│       ├── calendario/       # Calendario
│       ├── alertas/          # Sistema de alertas
│       ├── crecimiento/      # Métricas
│       ├── clima/            # Información climática
│       ├── mis-cultivos/     # Gestión de cultivos
│       └── perfil/           # Edición de perfil
└── README.md                 # Este archivo
```

## 🔧 Configuración Firebase

### 1. Crear Proyecto Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Habilita **Authentication** y **Firestore Database**

### 2. Configurar Authentication

1. En **Authentication > Sign-in method**:
   - Habilita **Email/Password**
   - Habilita **Google** (configura OAuth consent screen si es necesario)

### 3. Configurar Firestore

1. En **Firestore Database**:
   - Crea una base de datos en modo de prueba
   - O configura reglas de seguridad (ver sección Reglas)

### 4. Obtener Configuración

1. En **Project Settings > General**:
   - Copia la configuración del SDK
   - O usa la configuración automática

### 5. Actualizar Configuración

Edita `js/core/firebase.config.js`:

```javascript
export const firebaseConfig = {
    apiKey: "tu-api-key-real",
    authDomain: "tu-proyecto.firebaseapp.com",
    projectId: "tu-proyecto-id",
    storageBucket: "tu-proyecto.appspot.com",
    messagingSenderId: "123456789",
    appId: "tu-app-id"
};
```

### 6. Dominios Autorizados

En **Authentication > Settings > Authorized domains**:
- Agrega `*.github.io` para GitHub Pages
- Agrega `localhost` para desarrollo local

## 🚀 Cómo Ejecutar Localmente

### Opción 1: Live Server (VS Code)

1. Instala la extensión **Live Server** en VS Code
2. Click derecho en `index.html`
3. Selecciona **"Open with Live Server"**

### Opción 2: Python HTTP Server

```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

### Opción 3: Node.js http-server

```bash
# Instalar globalmente
npm install -g http-server

# Ejecutar
http-server -p 8000
```

### Opción 4: PHP Built-in Server

```bash
php -S localhost:8000
```

## 🌐 Despliegue en GitHub Pages

### 1. Crear Repositorio

1. Crea un nuevo repositorio en GitHub
2. Sube todos los archivos del proyecto

### 2. Configurar GitHub Pages

1. Ve a **Settings > Pages**
2. En **Source**, selecciona **Deploy from a branch**
3. Selecciona la rama **main** (o **master**)
4. Click en **Save**

### 3. Configurar Firebase

1. En Firebase Console, agrega tu dominio GitHub Pages:
   - `tu-usuario.github.io`
   - `tu-usuario.github.io/tu-repositorio` (si no es root)

### 4. Verificar Despliegue

- Tu app estará disponible en: `https://tu-usuario.github.io/tu-repositorio`
- La autenticación funcionará correctamente

## 📊 Reglas Firestore (Demo)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{db}/documents {
    match /users/{uid} {
      allow read, write: if request.auth != null && request.auth.uid == uid;
    }
  }
}
```

## 🎨 Personalización

### Temas

Los temas se configuran en `css/theme.css`:
- Variables CSS para colores
- Soporte para tema claro/oscuro/sistema
- Transiciones suaves

### Estilos

- **BEM Methodology** con prefijos: `l-` (layout), `c-` (componentes), `u-` (utilidades)
- **Bootstrap 5.3** para componentes y grid
- **Responsive design** para móviles y tablets

### Datos

- Los datos se cargan desde archivos JSON en `/data`
- Sistema de caché en memoria para mejor rendimiento
- Fácil reemplazo por Firestore real

## 🔒 Seguridad

- **Firebase Auth** maneja contraseñas de forma segura
- **Reglas Firestore** protegen datos del usuario
- **Validación** en frontend y backend
- **HTTPS** obligatorio en producción

## 📱 Responsive Design

- **Mobile-first** approach
- **Sidebar colapsable** en móviles
- **Grid system** de Bootstrap
- **Breakpoints** estándar

## ♿ Accesibilidad

- **ARIA labels** y roles
- **Navegación por teclado**
- **Focus visible**
- **Contraste correcto**
- **Screen reader** compatible

## 🧪 Testing

### Funcionalidades a Verificar

- [ ] Login/registro con email/password
- [ ] Login con Google
- [ ] Navegación entre módulos
- [ ] Cambio de temas
- [ ] Sidebar colapsable
- [ ] Menú de perfil desplegable
- [ ] Reloj funcional
- [ ] Gráficos Chart.js
- [ ] Responsive en móviles
- [ ] Accesibilidad por teclado

### Navegadores Soportados

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🐛 Troubleshooting

### Problemas Comunes

1. **Error de CORS**: Asegúrate de usar un servidor HTTP local
2. **Firebase no inicializa**: Verifica la configuración en `firebase.config.js`
3. **Módulos no cargan**: Verifica que estés usando un servidor con soporte ES6
4. **Autenticación falla**: Verifica dominios autorizados en Firebase

### Logs y Debug

- Abre **DevTools Console** para ver errores
- Verifica **Network tab** para requests fallidos
- Usa **Application tab** para ver localStorage

## 📈 Roadmap

### Versión 1.1
- [ ] Módulo de riego funcional
- [ ] Calendario de actividades
- [ ] Sistema de alertas
- [ ] Métricas de crecimiento

### Versión 1.2
- [ ] Integración completa con Firestore
- [ ] Notificaciones push
- [ ] Exportación de datos
- [ ] Múltiples idiomas

### Versión 2.0
- [ ] App móvil nativa
- [ ] IoT integration
- [ ] Machine Learning
- [ ] API REST

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

## 📞 Soporte

- **Issues**: [GitHub Issues](https://github.com/tu-usuario/SIGPA-DEMO/issues)
- **Documentación**: [Wiki del proyecto](https://github.com/tu-usuario/SIGPA-DEMO/wiki)
- **Email**: tu-email@ejemplo.com

## 🙏 Agradecimientos

- **Firebase** por la infraestructura backend
- **Bootstrap** por el framework CSS
- **Chart.js** por las librerías de gráficos
- **Bootstrap Icons** por los iconos
- **Google Fonts** por la tipografía Outfit

---

**SIGPA Demo** - Sistema de Gestión de Producción Agrícola
Desarrollado con ❤️ para la agricultura moderna
