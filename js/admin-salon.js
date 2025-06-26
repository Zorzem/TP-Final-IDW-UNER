// ========== FUNCIONES DE STORAGE ==========

// Clave única para identificar los datos en el localStorage
const STORAGE_KEY = "salones_data";

// Inicializa el localStorage con datos de ejemplo si está vacío
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
      { id: 9, nombre: "Salón Fiesta 9", capacidad: 65, precio: 3300, imagen: "salon9.jpg" },
    ];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(salonesIniciales));
  }
}

//Obtiene todos los salones almacenados en localStorage, retorna vacío si no hay datos
function obtenerSalones() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
}

// Guarda la lista completa de salones en localStorage.
function guardarSalones(salones) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(salones));
}

// Muestra un mensaje de éxito, error o confirmación con SweetAlert2
function mostrarMensaje(tipo, mensaje) {
  switch (tipo) {
    case "success":
      Swal.fire({
        icon: "success",
        title: "¡Éxito!",
        text: mensaje,
        timer: 2000,
        showConfirmButton: false,
      });
      break;
    case "error":
      Swal.fire({
        icon: "error",
        title: "¡Error!",
        text: mensaje,
        timer: 2000,
        showConfirmButton: false,
      });
      break;
    case "warning":
      Swal.fire({
        icon: "warning",
        title: "¡Advertencia!",
        text: mensaje,
        timer: 2000,
        showConfirmButton: false,
      });
      break;
    case "confirm":
      // Confirmación de eliminación
      Swal.fire({
        title: "¿Estás seguro?",
        text: mensaje,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí",
        cancelButtonText: "No",
        focusCancel: true,
      }).then((result) => {
        if (result.isConfirmed) {
          // Si el usuario confirma, ejecutamos la acción de eliminación
          eliminarSalon();
        }
      });
      break;
    default:
      console.error("Tipo de mensaje no soportado");
      break;
  }
}

/* ———————————————————————————————————————————————————————————————————————————————————— */

// ========== CRUD ==========

function crearSalon(nombre, capacidad, precio, imagen) {
  const salones = obtenerSalones();
  const nuevoId = salones.length > 0 ? Math.max(...salones.map((s) => s.id)) + 1 : 1;
  const nuevoSalon = {
    id: nuevoId,
    nombre,
    capacidad: parseInt(capacidad),
    precio: parseFloat(precio),
    imagen,
  };
  salones.push(nuevoSalon);
  guardarSalones(salones);
  mostrarMensaje("success", "Salón creado correctamente");
  return nuevoSalon;
}

function actualizarSalon(id, nombre, capacidad, precio, imagen) {
  const salones = obtenerSalones();
  const index = salones.findIndex((s) => s.id === id);
  if (index !== -1) {
    salones[index] = {
      ...salones[index],
      nombre,
      capacidad: parseInt(capacidad),
      precio: parseFloat(precio),
      imagen,
    };
    guardarSalones(salones);
    mostrarMensaje("success", "Salón actualizado correctamente");
    return salones[index];
  }
  mostrarMensaje("error", "Hubo un error al actualizar el salón");
  return null;
}

// ========== UI ==========
function listarSalones() {
  const salones = obtenerSalones();
  let html = `
    <h3>Lista de Salones</h3>
    <table class="table table-striped">
        <thead>
            <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Capacidad</th>
                <th>Precio</th>
                <th>Imagen</th>
                <th>Acciones</th>
            </tr>
        </thead>
        <tbody>`;

  salones.forEach((salon) => {
    html += `
        <tr>
            <td>${salon.id}</td>
            <td>${salon.nombre}</td>
            <td>${salon.capacidad} personas</td>
            <td>$${salon.precio.toFixed(2)}</td>
            <td>${salon.imagen}</td>
            <td>
                <button class="btn btn-sm btn-warning" onclick="cargarVista('salones', 'editar', ${
                  salon.id
                })">Editar</button>
                <button class="btn btn-sm btn-danger" onclick="eliminarSalon(${salon.id})">Eliminar</button>
            </td>
        </tr>`;
  });

  html += `</tbody></table>`;
  document.getElementById("contenido-admin").innerHTML = html;
}

function mostrarFormularioCrear(salon = null) {
  const esEdicion = salon !== null;
  const formHtml = `
    <h3>${esEdicion ? "Editar" : "Crear"} Salón</h3>
    <form id="form-salones" class="needs-validation" novalidate>
        <input type="hidden" id="salon-id" value="${esEdicion ? salon.id : ""}">
        
        <div class="mb-3">
            <label for="nombre" class="form-label">Nombre</label>
            <input type="text" class="form-control" id="nombre" 
                   value="${esEdicion ? salon.nombre : ""}" required 
                   pattern="[A-Za-z0-9áéíóúÁÉÍÓÚñÑ\s]+">
            <div class="invalid-feedback">Por favor ingresa un nombre válido (letras, números y espacios).</div>
            <small class="text-muted">No se deben poner caracteres especiales o símbolos, solo letras (con o sin tilde), números y espacios.</small>
        </div>

        <div class="mb-3">
            <label for="capacidad" class="form-label">Capacidad</label>
            <input type="number" class="form-control" id="capacidad" min="1" max="200"
                   value="${esEdicion ? salon.capacidad : ""}" required >
            <div class="invalid-feedback">Por favor ingresa la capacidad</div>
            <small class="text-muted">Capacidad máxima 200 personas.</small>
        </div>

        <div class="mb-3">
            <label for="precio" class="form-label">Precio</label>
            <input type="number" step="0.01" class="form-control" id="precio" 
                   value="${esEdicion ? salon.precio : ''}" required min="0.01">
            <div class="invalid-feedback">Por favor ingresa un precio válido</div>
        </div>

        <div class="mb-3">
            <label for="imagen" class="form-label">Nombre de Imagen</label>
            <input type="text" class="form-control" id="imagen" 
                   value="${esEdicion ? salon.imagen : ""}" required 
                   pattern="[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s\-]+\.[a-zA-Z]{3,4}">
            <div class="invalid-feedback">Por favor ingresa el nombre de la imagen</div>
        </div>

        <button type="submit" class="btn btn-primary">${esEdicion ? "Actualizar" : "Guardar"}</button>
    </form>`;

  const contenidoAdmin = document.getElementById("contenido-admin");
  if (contenidoAdmin) {
    contenidoAdmin.innerHTML = formHtml;
  }

  const form = document.getElementById("form-salones");

  // Evento de submit
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const nombre = document.getElementById("nombre").value.trim();
    const imagen = document.getElementById("imagen").value.trim();

    const capacidad = document.getElementById("capacidad").value;
    const capacidad_num = parseInt(capacidad);

    const id = document.getElementById("salon-id").value;
    const precio = document.getElementById("precio").value;
    const precio_num = parseInt(precio);

    // Validación para nombre (permite letras, números, espacios y acentos)
    const nombreRegex = /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s]+$/;
    if (!nombreRegex.test(nombre)) {
      mostrarMensaje("error", "Nombre inválido. Use letras, números y espacios");
      return;
    }

    // Validación para imagen (permite letras, números, espacios, guiones y extensión)
    const imagenRegex = /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s\-]+\.[a-zA-Z]{3,4}$/;
    if (!imagenRegex.test(imagen)) {
      mostrarMensaje("error", "Formato de imagen inválido. Ejemplo: salon-fiesta.jpg");
      return;
    }

    if (isNaN(capacidad_num) || capacidad_num < 1 || capacidad_num > 200) {
      mostrarMensaje("error", "La capacidad debe ser un número entre 1 y 200");
      return;
    }

    if (isNaN(precio_num) || precio_num < 0.01) {
      mostrarMensaje("error", "El precio debe ser mayor a 0");
      return;
    }



    if (esEdicion) {
      actualizarSalon(parseInt(id), nombre, capacidad, precio, imagen);
      mostrarMensaje("success", "Salón actualizado correctamente");
    } else {
      crearSalon(nombre, capacidad, precio, imagen);
      mostrarMensaje("success", "Salón creado correctamente");
    }

    listarSalones();
  });
}

function mostrarFormularioEditar(id) {
  const salones = obtenerSalones();
  const salon = salones.find((s) => s.id === id);
  if (salon) {
    mostrarFormularioCrear(salon);
  } else {
    alert("Salón no encontrado");
    listarSalones();
  }
}

// ========== GLOBAL ==========
function cargarVista(categoria, accion, id = null) {
  if (categoria === "salones") {
    if (accion === "listar") {
      listarSalones();
    } else if (accion === "crear") {
      mostrarFormularioCrear();
    } else if (accion === "editar") {
      mostrarFormularioEditar(id);
    }
  }
}

function eliminarSalon(id) {
  Swal.fire({
    title: "¿Estás seguro?",
    text: "¡Este salón será eliminado permanentemente!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Sí, eliminar",
    cancelButtonText: "No, cancelar",
    reverseButtons: true,
  }).then((result) => {
    if (result.isConfirmed) {
      // Eliminar el salón
      const salones = obtenerSalones().filter((salon) => salon.id !== id);
      guardarSalones(salones);
      listarSalones();
      mostrarMensaje("success", "Salón eliminado con éxito");
    } else {
      Swal.fire("Cancelado", "El salón no fue eliminado.", "error");
    }
  });
}

function renderizarSalones() {
  const salones = obtenerSalones();
  const contenedor = document.getElementById("salones-container");
  contenedor.innerHTML = "";

  salones.forEach((salon) => {
    contenedor.innerHTML += `
        <div class="col">
            <div class="card h-100 shadow">
                <img src="img/${salon.imagen}" class="card-img-top border border-2 border-white" alt="${salon.nombre}" />
                <div class="card-body">
                    <h5 class="card-title">${salon.nombre}</h5>
                    <p class="card-text">Capacidad: ${salon.capacidad} personas</p>
                    <p class="fw-bold">$${salon.precio}</p>
                </div>
            </div>
        </div>
        `;
  });
}

// ========== INICIALIZACIÓN ==========

// Inicializa localStorage al cargar la página
document.addEventListener("DOMContentLoaded", function () {
  inicializarLocalStorageSalones();
  if (document.getElementById("salones-container")) {
    renderizarSalones();
  }
});

// Hacer funciones accesibles globalmente
window.cargarVista = cargarVista;
window.eliminarSalon = eliminarSalon;
window.listarSalones = listarSalones;
