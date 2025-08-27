// ===============================
// Alertas visuales con SweetAlert
// ===============================
function showSuccess(msg = 'Operación realizada correctamente.') {
  Swal.fire({ icon: 'success', title: '¡Éxito!', text: msg });
}

function showError(msg = 'Ocurrió un problema inesperado.') {
  Swal.fire({ icon: 'error', title: 'Error', text: msg });
}

function showWarning(msg = 'Verifica los datos antes de continuar.') {
  Swal.fire({ icon: 'warning', title: 'Advertencia', text: msg });
}

function showInfo(msg = 'Este es un mensaje informativo.') {
  Swal.fire({ icon: 'info', title: 'Información', text: msg });
}

// ===============================
// Enviar correo (llama al backend)
// ===============================
async function enviarCorreo() {
  try {
    const res = await fetch("http://localhost:3000/enviar-correo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        to: "correo@ejemplo.com",
        subject: "⚠️ Alerta de prueba",
        text: "Este es un correo de prueba enviado desde el sistema de alertas."
      })
    });

    if (res.ok) {
      showSuccess("📧 Correo enviado correctamente");
    } else {
      showError("❌ Error al enviar correo");
    }
  } catch (err) {
    showError("❌ Error en la conexión al servidor");
  }
}

// ===============================
// Enviar SMS (llama al backend)
// ===============================
async function enviarSms() {
  try {
    const res = await fetch("http://localhost:3000/enviar-sms", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        to: "+573001112233", // ⚠️ Cambia a un número real
        body: "Este es un SMS de prueba desde el sistema de alertas."
      })
    });

    if (res.ok) {
      showSuccess("📱 SMS enviado correctamente");
    } else {
      showError("❌ Error al enviar SMS");
    }
  } catch (err) {
    showError("❌ Error en la conexión al servidor");
  }
}

// ===============================
// Inicializar eventos
// ===============================
document.getElementById("btnEnviarCorreo").addEventListener("click", enviarCorreo);
document.getElementById("btnEnviarSms").addEventListener("click", enviarSms);
