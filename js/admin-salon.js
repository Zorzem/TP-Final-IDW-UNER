// ========== FUNCIONES DE STORAGE ==========

const STORAGE_KEY = "salones_data";

// Inicializa el localStorage con 9 salones si no existen
function inicializarLocalStorageSalones() {
  if (!localStorage.getItem(STORAGE_KEY)) {
    const salonesIniciales = [
      { id: 1, nombre: "Salón Fiesta 1", capacidad: 30, precio: 1500, imagen: "salon1.jpg" },
      { id: 2, nombre: "Salón Fiesta 2", capacidad: 50, precio: 2500, imagen: "salon2.jpg" },
      { id: 3, nombre: "Salón Fiesta 3", capacidad: 40, precio: 2000, imagen: "salon3.jpg" },
      { id: 4, nombre: "Salón Fiesta 4", capacidad: 60, precio: 3000, imagen: "salon4.jpg" },
      { id: 5, nombre: "Salón Fiesta 5", capacidad: 45, precio: 2200, imagen: "salon5.jpg" },
      { id: 6, nombre: "Salón Fiesta 6", capacidad: 70, precio: 3500, imagen: "salon6.jpg" },
      { id: 7, nombre: "Salón Fiesta 7", capacidad: 35, precio: 1800, imagen: "salon7.jpg" },
      { id: 8, nombre: "Salón Fiesta 8", capacidad: 55, precio: 2800, imagen: "salon8.jpg" },
      { id: 9, nombre: "Salón Fiesta 9", capacidad: 65, precio: 3300, imagen: "salon9.jpg" }
    ];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(salonesIniciales));
  }
}

// Obtener todos los salones guardados
function obtenerSalones() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
}

// Guardar todos los salones
function guardarSalones(salones) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(salones));
}

// Obtener siguiente ID (máximo + 1)
function obtenerSiguienteId() {
  const salones = obtenerSalones();
  if (salones.length === 0) return 1;
  const maxId = salones.reduce((max, s) => (s.id > max ? s.id : max), 0);
  return maxId + 1;
}

// Cargar salones en la tabla HTML
function cargarSalones() {
  const salones = obtenerSalones();
  const tbody = document.getElementById("salones-body");
  if (!tbody) {
    console.error("No se encontró el tbody con id 'salones-body'");
    return;
  }
  tbody.innerHTML = "";

  salones.forEach((salon) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${salon.id}</td>
      <td>${salon.nombre}</td>
      <td>${salon.capacidad} personas</td>
      <td>$${salon.precio.toFixed(2)}</td>
      <td><img src="../../img/salones/${salon.imagen}" class="table-img" alt="${salon.nombre}"></td>
      <td>
        <button class="btn btn-edit btn-sm me-2" onclick="confirmarAccion('editar', ${salon.id})">
          <i class="bi bi-pencil-fill"></i> Editar
        </button>
        <button class="btn btn-delete btn-sm" onclick="confirmarAccion('eliminar', ${salon.id})">
          <i class="bi bi-trash-fill"></i> Eliminar
        </button>
      </td>`;
    tbody.appendChild(tr);
  });
}

// Confirmar acción con SweetAlert2
function confirmarAccion(accion, id) {
  if (accion === "editar") {
    Swal.fire({
      title: "¿Estás seguro de editar este salón?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí, editar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#28a745"
    }).then((result) => {
      if (result.isConfirmed) {
        window.location.href = `/pages/admin/forms/form-salon.html?id=${id}`;
      }
    });
  } else if (accion === "eliminar") {
    Swal.fire({
      title: "¿Estás seguro de eliminar este salón?",
      text: "No podrás revertir esta acción.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#dc3545"
    }).then((result) => {
      if (result.isConfirmed) {
        eliminarSalon(id);
        Swal.fire("Eliminado!", "El salón ha sido eliminado.", "success");
      }
    });
  }
}

// Eliminar salón por ID
function eliminarSalon(id) {
  let salones = obtenerSalones();
  salones = salones.filter(salon => salon.id !== id);
  guardarSalones(salones);
  cargarSalones();
}

// Crear nuevo salón desde formulario
function crearSalon() {
  const nombreInput = document.getElementById("nombre");
  const capacidadInput = document.getElementById("capacidad");
  const precioInput = document.getElementById("precio");
  // Aquí puedes implementar el upload de imagen o usar un default
  const imagenNombre = "default.jpg";

  if (!nombreInput || !capacidadInput || !precioInput) {
    Swal.fire("Error", "No se encontraron los campos del formulario.", "error");
    return;
  }

  // Validar inputs mínimos (puedes agregar más validaciones)
  if (!nombreInput.value.trim() || !capacidadInput.value || !precioInput.value) {
    Swal.fire("Error", "Por favor completa todos los campos.", "error");
    return;
  }

  const salones = obtenerSalones();
  const nuevoId = obtenerSiguienteId();

  const nuevoSalon = {
    id: nuevoId,
    nombre: nombreInput.value.trim(),
    capacidad: parseInt(capacidadInput.value),
    precio: parseFloat(precioInput.value),
    imagen: imagenNombre,
  };

  salones.push(nuevoSalon);
  guardarSalones(salones);

  Swal.fire({
    icon: "success",
    title: "¡Salón creado!",
    text: "El salón se creó correctamente.",
    timer: 2000,
    showConfirmButton: false,
    timerProgressBar: true,
  }).then(() => {
    window.location.href = "/pages/admin/lists/list-salon.html";
  });
}

// Al cargar la página, inicializar y cargar la tabla
window.addEventListener("DOMContentLoaded", () => {
  inicializarLocalStorageSalones();
  cargarSalones();
});
