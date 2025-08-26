# 🌾 SIGPA Demo

**Sistema de Gestión de Producción Agrícola**  
Demo web para gestionar cultivos, clima, riego, alertas y más. Ideal para ejecución local y pruebas de concepto.

---

## 🚀 Funcionalidades principales

- 🧭 Navegación sin recargas (Hash Router)
- 🎨 Tema claro/oscuro con memoria de preferencia
- 📊 Dashboard con gráficos interactivos (Chart.js)
- 🧩 Módulos funcionales con datos JSON de ejemplo
- 📱 Diseño responsive (mobile-first)
- ♿ Accesibilidad (navegación por teclado + ARIA)

---

## ⚙️ Instalación rápida

### 1. Clona el repositorio

```bash
git clone https://github.com/tu-usuario/SIGPA-DEMO.git
cd SIGPA-DEMO
```

### 2. Instala dependencias

```bash
npm install
```

### 3. Ejecuta servidor de desarrollo

```bash
npm run dev
```

Abre [http://localhost:8080](http://localhost:8080) en tu navegador.

### 4. Servidor estático (opcional)

```bash
npm start
```

---

## 🗂️ Estructura del Proyecto

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

---

## 📦 Scripts disponibles (`npm run`)

| Script         | Descripción                                 |
|----------------|---------------------------------------------|
| `dev`          | Servidor local con recarga en vivo (`live-server`) |
| `start`        | Servidor estático (`http-server`)           |
| `format`       | Formatea todo el código con Prettier        |
| `format:js`    | Formatea solo archivos JS                   |
| `format:html`  | Formatea HTML y parciales                   |
| `format:css`   | Formatea hojas de estilo                    |
| `format:json`  | Formatea datos JSON                         |
| `format:md`    | Formatea archivos Markdown                  |
| `lint:format`  | Verifica formato sin modificar              |

---

## 📐 Diseño

- **Mobile-first** con Bootstrap 5.3
- **Gráficos interactivos** con Chart.js 4.x
- **Variables CSS** para control de temas
- **Layout modular** y componentes reutilizables

---

## 🧪 Checklist funcional

- [ ] Navegación entre módulos
- [ ] Cambio de tema (claro/oscuro)
- [ ] Sidebar responsive
- [ ] Reloj funcional
- [ ] Datos cargados desde JSON
- [ ] Gráficos con Chart.js
- [ ] Accesibilidad completa

---

## 📄 Licencia

MIT. Ver archivo `LICENSE`.

---

> Desarrollado con ❤️ para apoyar la agricultura moderna.

