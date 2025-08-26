# Code Quality Workflows

Este documento describe los workflows de GitHub Actions implementados para mantener la calidad del código en el proyecto SIGPA-DEMO.

## 🚀 Workflows Disponibles

### 1. Format Code (`format.yml`)
**Propósito:** Formatear automáticamente todo el código del proyecto usando Prettier.

**Triggers:**
- Push a `main`
- Pull Request a `main`
- Manual (workflow_dispatch)

**Funcionalidades:**
- Formatea archivos JavaScript, HTML, CSS, JSON y Markdown
- Aplica configuración consistente de Prettier
- Commitea y pushea cambios automáticamente
- Comenta en PRs cuando se aplican cambios de formato

### 2. Lint and Quality Check (`lint.yml`)
**Propósito:** Verificar la calidad del código y detectar problemas comunes.

**Triggers:**
- Push a `main`
- Pull Request a `main`
- Manual (workflow_dispatch)

**Funcionalidades:**
- Verifica que el código esté correctamente formateado
- Detecta console.log en código de producción
- Identifica comentarios TODO y FIXME
- Analiza tamaños de archivo
- Verifica accesibilidad básica
- Genera reportes de calidad

### 3. Code Quality Pipeline (`code-quality.yml`)
**Propósito:** Pipeline completo que ejecuta formateo y linting en secuencia.

**Triggers:**
- Push a `main`
- Pull Request a `main`
- Manual (workflow_dispatch)

**Funcionalidades:**
- Ejecuta formateo primero
- Luego ejecuta verificaciones de calidad
- Notifica resultados en PRs
- Genera reportes comprehensivos

## 🔧 Configuración Local

### Instalación de Dependencias
```bash
# Instalar Prettier y plugin de Tailwind CSS
pnpm add -D prettier prettier-plugin-tailwindcss
```

### Scripts Disponibles
```bash
# Formatear todo el código
pnpm format

# Verificar formato sin cambiar archivos
pnpm format:check

# Formatear tipos específicos de archivos
pnpm format:js      # Solo JavaScript
pnpm format:html    # Solo HTML
pnpm format:css     # Solo CSS
pnpm format:json    # Solo JSON
pnpm format:md      # Solo Markdown

# Verificar formato (para CI)
pnpm lint:format
```

### Configuración de Prettier
El proyecto incluye un archivo `.prettierrc` con configuración optimizada:

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false,
  "bracketSpacing": true,
  "bracketSameLine": false,
  "arrowParens": "avoid",
  "endOfLine": "lf",
  "plugins": ["prettier-plugin-tailwindcss"]
}
```

### Archivos Excluidos
El archivo `.prettierignore` excluye:
- `node_modules/`
- Archivos de build
- Archivos de lock
- Assets y datos
- Archivos de configuración

## 📊 Monitoreo y Reportes

### GitHub Actions Summary
Cada workflow genera un resumen detallado en la pestaña "Actions" de GitHub, incluyendo:
- Estado de cada paso
- Archivos formateados
- Problemas detectados
- Recomendaciones

### Comentarios en PRs
Los workflows comentan automáticamente en Pull Requests con:
- Resumen de cambios aplicados
- Estado de las verificaciones
- Instrucciones para desarrolladores
- Recomendaciones de mejora

## 🎯 Mejores Prácticas

### Para Desarrolladores
1. **Formatear antes de commitear:**
   ```bash
   pnpm format
   git add .
   git commit -m "Your commit message"
   ```

2. **Verificar formato localmente:**
   ```bash
   pnpm format:check
   ```

3. **Instalar extensión de Prettier en tu editor:**
   - VS Code: "Prettier - Code formatter"
   - WebStorm: Prettier plugin
   - Vim/Neovim: Prettier plugin

### Para el Equipo
1. **Revisar workflows regularmente:**
   - Monitorear ejecuciones en GitHub Actions
   - Revisar reportes de calidad
   - Ajustar configuración según necesidades

2. **Mantener configuración actualizada:**
   - Actualizar versiones de Prettier
   - Ajustar reglas según estándares del equipo
   - Agregar nuevos tipos de archivo según sea necesario

## 🔍 Troubleshooting

### Problemas Comunes

#### Workflow falla en verificación de formato
```bash
# Solución: Formatear localmente y pushear
pnpm format
git add .
git commit -m "Fix formatting"
git push
```

#### Conflictos de formato
```bash
# Solución: Rebase y reformatear
git pull --rebase origin main
pnpm format
git add .
git rebase --continue
```

#### Archivos no se formatean
Verificar que no estén en `.prettierignore`:
```bash
# Verificar archivo específico
pnpm prettier --check path/to/file.js
```

### Logs y Debugging
- Revisar logs completos en GitHub Actions
- Usar `pnpm prettier --debug-check` para debugging local
- Verificar configuración con `pnpm prettier --config-precedence prefer-file`

## 🚀 Próximos Pasos

### Mejoras Planificadas
1. **ESLint para JavaScript:**
   - Linting de código JavaScript
   - Reglas específicas para el proyecto
   - Integración con Prettier

2. **Stylelint para CSS:**
   - Linting de archivos CSS
   - Verificación de propiedades
   - Reglas de Tailwind CSS

3. **Husky para pre-commit hooks:**
   - Formateo automático antes de commits
   - Verificación de calidad local
   - Prevención de commits con problemas

4. **Métricas de calidad:**
   - Coverage de código
   - Complejidad ciclomática
   - Duplicación de código

### Configuración Avanzada
- Reglas personalizadas por directorio
- Integración con IDEs del equipo
- Configuración específica por tipo de archivo
- Workflows condicionales basados en cambios

## 📚 Recursos Adicionales

- [Documentación oficial de Prettier](https://prettier.io/docs/en/)
- [Plugin de Tailwind CSS para Prettier](https://github.com/tailwindlabs/prettier-plugin-tailwindcss)
- [GitHub Actions documentation](https://docs.github.com/en/actions)
- [Configuración de Prettier](https://prettier.io/docs/en/configuration.html)

---

**Nota:** Estos workflows están diseñados para mejorar la calidad del código de manera automática. Si tienes preguntas o necesitas ajustes, consulta con el equipo de desarrollo.
