# Módulo: Dashboard y Alertas

👨‍💻 **Colaboradores:**  
- Johan Nicolás Bautista Raba  
- Juan Morales  

## 📌 Descripción
Este módulo extiende el Dashboard general con funcionalidades de **alertas y notificaciones**.  

## 🚀 Reglas para colaborar
- No modificar el Dashboard principal.  
- Documentar la lógica de integración de alertas aquí.  

---

Aplicación que utiliza **SweetAlert2** y **Animate.css** para mostrar diferentes tipos de alertas con animaciones.  
Además, incluye un sistema de **notificaciones externas** vía **correo electrónico y SMS** para ampliar el alcance de las alertas.  

# 🚀 Características
- Botones para probar diferentes tipos de alertas:  
  - ✅ Éxito  
  - ❌ Error  
  - ⚠️ Advertencia  
  - ℹ️ Información  
- Notificaciones externas:  
  - 📧 Envío de alertas por **correo electrónico (EmailJS)**  
  - 📱 Envío de alertas por **SMS (Textbelt)**  

# 🛠️ Tecnologías utilizadas
- **Frontend**  
  - HTML5  
  - CSS  
  - JavaScript  
  - SweetAlert2 (alertas personalizadas)  
  - Animate.css (animaciones)  

- **Servicios externos (gratis y fáciles):**  
  - **EmailJS** → para envío de correos electrónicos.  
  - **Textbelt** → para envío de SMS (limitado a 1 por día en plan gratuito).  

# 📁 Estructura del proyecto

- dashboard_alertas  

  ├── index.html      → Página principal  
  ├── alertas.css     → Estilos personalizados  
  ├── alertas.js      → Lógica de las alertas y notificaciones externas  
  └── README.md  

# ⚙️ Lógica de notificaciones externas

### 📧 Correo electrónico (EmailJS)

1. Crear cuenta en [EmailJS](https://www.emailjs.com/).  
2. Configurar servicio (ejemplo: Gmail).  
3. Obtener **Service ID, Template ID y Public Key**.  
4. Implementar en `alertas.js`:  

```javascript
function enviarCorreo(alertaTipo, mensaje) {
    emailjs.send("service_id", "template_id", {
        tipo: alertaTipo,
        mensaje: mensaje,
        destinatario: "correo@ejemplo.com"
    }, "public_key")
    .then(() => {
        console.log("📧 Correo enviado con éxito");
    }, (err) => {
        console.error("❌ Error al enviar correo", err);
    });
}

### 📱 SMS (Textbelt)

1. No requiere registro ni instalación adicional.  
2. La API gratuita de Textbelt permite **1 SMS al día sin costo**.  
3. Solo necesitas el número de teléfono de destino en formato internacional (ejemplo: `+573001234567`).  
4. Implementar en `alertas.js`:  

````javascript
function enviarSMS(numero, mensaje) {
    fetch("https://textbelt.com/text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            phone: numero,
            message: mensaje,
            key: "textbelt"  // clave gratuita de Textbelt
        }),
    })
    .then(r => r.json())
    .then(data => {
        if (data.success) {
            console.log("📱 SMS enviado con éxito");
        } else {
            console.error("❌ Error al enviar SMS", data);
        }
    });
}
