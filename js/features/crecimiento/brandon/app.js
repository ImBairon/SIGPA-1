// ==============================
// Tabs
// ==============================
document.querySelectorAll(".tab-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    document.querySelectorAll(".content").forEach(c => c.hidden = true);
    document.getElementById(btn.dataset.tab).hidden = false;
  });
});

// ==============================
// Form Registro
// ==============================
const form = document.getElementById("form-registro");
const tbody = document.querySelector("#tabla-historial tbody");
let datos = [];

form.addEventListener("submit", e => {
  e.preventDefault();
  const fd = new FormData(form);
  const registro = {
    cultivo: fd.get("cultivo"),
    altura: fd.get("altura"),
    fecha: fd.get("fecha"),
    observaciones: fd.get("observaciones")
  };
  datos.push(registro);
  actualizarTabla();
  mostrarToast("Registro guardado", `${registro.cultivo} - ${registro.altura} cm`);
  form.reset();
});

// ==============================
// Tabla Historial
// ==============================
function actualizarTabla() {
  tbody.innerHTML = "";
  datos.forEach((r, i) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${r.cultivo}</td>
      <td>${r.altura} cm</td>
      <td>${r.fecha}</td>
      <td><button class="btn ver-detalle" data-i="${i}">Ver</button></td>
    `;
    tbody.appendChild(tr);
  });
}

// ==============================
// Modal
// ==============================
const modal = document.getElementById("modal-detalle");
const detalleContenido = document.getElementById("detalle-contenido");

document.addEventListener("click", e => {
  if (e.target.classList.contains("ver-detalle")) {
    const r = datos[e.target.dataset.i];
    detalleContenido.innerHTML = `
      <p><b>Cultivo:</b> ${r.cultivo}</p>
      <p><b>Altura:</b> ${r.altura} cm</p>
      <p><b>Fecha:</b> ${r.fecha}</p>
      <p><b>Observaciones:</b> ${r.observaciones || "N/A"}</p>
    `;
    modal.style.display = "flex";
  }
});
document.getElementById("btn-cerrar-modal").onclick = () => modal.style.display = "none";

// ==============================
// Toast
// ==============================
const toast = document.getElementById("toast");
function mostrarToast(titulo, desc) {
  toast.querySelector(".title").textContent = titulo;
  toast.querySelector(".desc").textContent = desc;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 3000);
}

// ==============================
// Gráfica
// ==============================
const ctx = document.getElementById("grafica").getContext("2d");
let grafica = new Chart(ctx, {
  type: "bar",
  data: {
    labels: [],
    datasets: [{
      label: "Altura (cm)",
      data: [],
      backgroundColor: "#4caf50"
    }]
  },
  options: { responsive: true }
});

function actualizarGrafica() {
  grafica.data.labels = datos.map(r => r.fecha);
  grafica.data.datasets[0].data = datos.map(r => r.altura);
  grafica.update();
}

// cada vez que se agrega dato => actualizar grafica
form.addEventListener("submit", () => actualizarGrafica());
