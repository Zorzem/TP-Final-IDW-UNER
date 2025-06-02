// ========== FUNCIONES DE STORAGE ==========

const STORAGE_KEY_IMAGES = "imagenes_data";

// Inicializa el localStorage con 9 imágenes si no existen
function inicializarLocalStorageImagenes() {
  if (!localStorage.getItem(STORAGE_KEY_IMAGES)) {
    const imagenesIniciales = [
      { id: 1, nombre: "Imagen Salón 1", archivo: "salon1.jpg" },
      { id: 2, nombre: "Imagen Salón 2", archivo: "salon2.jpg" },
      { id: 3, nombre: "Imagen Salón 3", archivo: "salon3.jpg" },
      { id: 4, nombre: "Imagen Salón 4", archivo: "salon4.jpg" },
      { id: 5, nombre: "Imagen Salón 5", archivo: "salon5.jpg" },
      { id: 6, nombre: "Imagen Salón 6", archivo: "salon6.jpg" },
      { id: 7, nombre: "Imagen Salón 7", archivo: "salon7.jpg" },
      { id: 8, nombre: "Imagen Salón 8", archivo: "salon8.jpg" },
      { id: 9, nombre: "Imagen Salón 9", archivo: "salon9.jpg" }
    ];
    localStorage.setItem(STORAGE_KEY_IMAGES, JSON.stringify(imagenesIniciales));
  }
}

// Obtener todas las imágenes guardadas
function obtenerImagenes() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY_IMAGES)) || [];
}

// Guardar todas las imágenes
function guardarImagenes(imagenes) {
  localStorage.setItem(STORAGE_KEY_IMAGES, JSON.stringify(imagenes));
}

// Obtener siguiente ID (máximo + 1)
function obtenerSiguienteIdImagen() {
  const imagenes = obtenerImagenes();
  if (imagenes.length === 0) return 1;
  const maxId = imagenes.reduce((max, img) => (img.id > max ? img.id : max), 0);
  return maxId + 1;
}

// Cargar imágenes en la tabla HTML
function cargarImagenes() {
  const imagenes = obtenerImagenes();
  const tbody = document.getElementById("imagenes-body");
  if (!tbody) {
    console.error("No se encontró el tbody con id 'imagenes-body'");
    return;
  }
  tbody.innerHTML = "";

  imagenes.forEach((imagen) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${imagen.id}</td>
      <td>${imagen.nombre}</td>
      <td><img src="../../img/${imagen.archivo}" class="table-img" alt="${imagen.nombre}"></td>
      <td>
        <button class="btn btn-edit btn-sm me-2" onclick="confirmarAccionImagen('editar', ${imagen.id})">
          <i class="bi bi-pencil-fill"></i> Editar
        </button>
        <button class="btn btn-delete btn-sm" onclick="confirmarAccionImagen('eliminar', ${imagen.id})">
          <i class="bi bi-trash-fill"></i> Eliminar
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });

}

// Confirmar acción con SweetAlert2 para imágenes
function confirmarAccionImagen(accion, id) {
  if (accion === "editar") {
    Swal.fire({
      title: "¿Estás seguro de editar esta imagen?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí, editar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#28a745"
    }).then((result) => {
      if (result.isConfirmed) {
        window.location.href = `/pages/admin/forms/form-imagen.html?id=${id}`;
      }
    });
  } else if (accion === "eliminar") {
    Swal.fire({
      title: "¿Estás seguro de eliminar esta imagen?",
      text: "No podrás revertir esta acción.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#dc3545"
    }).then((result) => {
      if (result.isConfirmed) {
        eliminarImagen(id);
        Swal.fire("Eliminado!", "La imagen ha sido eliminada.", "success");
      }
    });
  }
}

// Eliminar imagen por ID
function eliminarImagen(id) {
  let imagenes = obtenerImagenes();
  imagenes = imagenes.filter(img => Number(img.id) !== Number(id));
  guardarImagenes(imagenes);
  cargarImagenes();
}

// Crear nueva imagen desde formulario (ejemplo básico)
function crearImagen() {
  const nombreInput = document.getElementById("nombre");
  const archivoInput = document.getElementById("archivo");

  if (!nombreInput || !archivoInput) {
    Swal.fire("Error", "No se encontraron los campos del formulario.", "error");
    return;
  }

  if (!nombreInput.value.trim() || !archivoInput.value.trim()) {
    Swal.fire("Error", "Por favor completa todos los campos.", "error");
    return;
  }

  const imagenes = obtenerImagenes();
  const nuevoId = obtenerSiguienteIdImagen();

  const nuevoImagen = {
    id: nuevoId,
    nombre: nombreInput.value.trim(),
    archivo: archivoInput.value.trim(),
  };

  imagenes.push(nuevoImagen);
  guardarImagenes(imagenes);

  Swal.fire({
    icon: "success",
    title: "¡Imagen creada!",
    text: "La imagen se creó correctamente.",
    timer: 2000,
    showConfirmButton: false,
    timerProgressBar: true,
  }).then(() => {
    window.location.href = "/pages/admin/lists/list-imagen.html";
  });
}

// Al cargar la página, inicializar y cargar la tabla de imágenes
window.addEventListener("DOMContentLoaded", () => {
  inicializarLocalStorageImagenes();
  cargarImagenes();
});
