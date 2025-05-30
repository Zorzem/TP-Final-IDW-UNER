// ========== CONSTANTES ==========
const IMAGENES_KEY = "imagenes_data";

// ========== STORAGE ==========
function inicializarImagenesStorage() {
  if (!localStorage.getItem(IMAGENES_KEY)) {
    const imagenesIniciales = [
      { id: 1, titulo: "Candy Bar", descripcion: "Mesa dulce temática", archivo: "candybar.jpg" },
      { id: 2, titulo: "Globos", descripcion: "Decoración con globos", archivo: "globos.jpg" }
    ];
    localStorage.setItem(IMAGENES_KEY, JSON.stringify(imagenesIniciales));
  }
}

function obtenerImagenes() {
  return JSON.parse(localStorage.getItem(IMAGENES_KEY)) || [];
}

function guardarImagenes(imagenes) {
  localStorage.setItem(IMAGENES_KEY, JSON.stringify(imagenes));
}

function crearImagen(titulo, descripcion, archivo) {
  const imagenes = obtenerImagenes();
  const nuevoId = imagenes.length > 0 ? Math.max(...imagenes.map(i => i.id)) + 1 : 1;
  const nueva = { id: nuevoId, titulo, descripcion, archivo };
  imagenes.push(nueva);
  guardarImagenes(imagenes);
}

function actualizarImagen(id, titulo, descripcion, archivo) {
  const imagenes = obtenerImagenes();
  const index = imagenes.findIndex(i => i.id === id);
  if (index !== -1) {
    imagenes[index] = { id, titulo, descripcion, archivo };
    guardarImagenes(imagenes);
  }
}

function eliminarImagen(id) {
  const imagenes = obtenerImagenes().filter(i => i.id !== id);
  guardarImagenes(imagenes);
}

// ========== UI ==========
function listarImagenes() {
  const imagenes = obtenerImagenes();
  let html = `
    <h3>Lista de Imágenes</h3>
    <table class="table table-striped">
      <thead>
        <tr>
          <th>ID</th>
          <th>Título</th>
          <th>Descripción</th>
          <th>Archivo</th>
          <th>Vista Previa</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>`;

  imagenes.forEach(img => {
    html += `
      <tr>
        <td>${img.id}</td>
        <td>${img.titulo}</td>
        <td>${img.descripcion}</td>
        <td>${img.archivo}</td>
        <td><img src="../../img/${img.archivo}" alt="${img.titulo}" style="width: 100px" onerror="this.onerror=null; this.src='../../img/no-image.png';"></td>
        <td>
          <button class="btn btn-sm btn-warning" onclick="cargarVista('imagenes', 'editar', ${img.id})">Editar</button>
          <button class="btn btn-sm btn-danger" onclick="eliminarImagenConfirmado(${img.id})">Eliminar</button>
        </td>
      </tr>`;
  });

  html += `</tbody></table>`;
  document.getElementById("contenido-admin").innerHTML = html;
}

function mostrarFormularioImagen(imagen = null) {
  const esEdicion = imagen !== null;
  const formHtml = `
    <h3>${esEdicion ? 'Editar' : 'Crear'} Imagen</h3>
    <form id="form-imagen">
      <input type="hidden" id="imagen-id" value="${esEdicion ? imagen.id : ''}" />
      <div class="mb-3">
        <label for="titulo" class="form-label">Título</label>
        <input type="text" class="form-control" id="titulo" value="${esEdicion ? imagen.titulo : ''}" required />
      </div>
      <div class="mb-3">
        <label for="descripcion" class="form-label">Descripción</label>
        <textarea class="form-control" id="descripcion" required>${esEdicion ? imagen.descripcion : ''}</textarea>
      </div>
      <div class="mb-3">
        <label for="archivo" class="form-label">Nombre del Archivo (ej: imagen.jpg)</label>
        <input type="text" class="form-control" id="archivo" value="${esEdicion ? imagen.archivo : ''}" required />
      </div>
      <button type="submit" class="btn btn-primary">${esEdicion ? 'Actualizar' : 'Guardar'}</button>
    </form>`;

  document.getElementById("contenido-admin").innerHTML = formHtml;

  document.getElementById("form-imagen").addEventListener("submit", function (e) {
    e.preventDefault();
    const id = parseInt(document.getElementById("imagen-id").value) || null;
    const titulo = document.getElementById("titulo").value.trim();
    const descripcion = document.getElementById("descripcion").value.trim();
    const archivo = document.getElementById("archivo").value.trim();

    if (!titulo || !descripcion || !archivo) {
      alert("Todos los campos son obligatorios");
      return;
    }

    if (esEdicion) {
      actualizarImagen(id, titulo, descripcion, archivo);
      alert("Imagen actualizada correctamente");
    } else {
      crearImagen(titulo, descripcion, archivo);
      alert("Imagen creada correctamente");
    }

    listarImagenes();
  });
}

function mostrarFormularioEditarImagen(id) {
  const imagen = obtenerImagenes().find(i => i.id === id);
  if (imagen) {
    mostrarFormularioImagen(imagen);
  } else {
    alert("Imagen no encontrada");
    listarImagenes();
  }
}

function eliminarImagenConfirmado(id) {
  if (confirm("¿Estás seguro de eliminar esta imagen?")) {
    eliminarImagen(id);
    listarImagenes();
    alert("Imagen eliminada correctamente");
  }
}

// ========== INICIALIZACIÓN ==========
document.addEventListener("DOMContentLoaded", function () {
  inicializarImagenesStorage();
});

// ========== INTEGRACIÓN GLOBAL ==========
const originalCargarVista = window.cargarVista || function () {};

window.cargarVista = function (categoria, accion, id = null) {
  if (categoria === 'imagenes') {
    if (accion === 'listar') listarImagenes();
    else if (accion === 'crear') mostrarFormularioImagen();
    else if (accion === 'editar') mostrarFormularioEditarImagen(id);
  } else {
    originalCargarVista(categoria, accion, id);
  }
};
