// SweetAlert: mensaje general
function mostrarMensaje(tipo, mensaje) {
  Swal.fire({
    icon: tipo,
    title: mensaje,
    timer: 2000,
    showConfirmButton: false
  });
}

// SweetAlert: confirmar acciones
function confirmarAccion(mensaje, callback) {
  Swal.fire({
    title: mensaje,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#28a745',
    cancelButtonColor: '#f06292',
    confirmButtonText: 'Sí, confirmar'
  }).then((result) => {
    if (result.isConfirmed) callback();
  });
}

// Valida nombre sin símbolos
function validarTextoSinSimbolos(texto) {
  const regex = /^[a-zA-Z0-9\sáéíóúÁÉÍÓÚñÑ]+$/;
  return regex.test(texto);
}

// Carga inicial
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('formImagen');
  const nombreInput = document.getElementById('nombreImagen');
  const archivoInput = document.getElementById('archivo');
  const tablaBody = document.getElementById('imagenTableBody');

  let contadorID = 1;

  // Evento submit
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const nombre = nombreInput.value.trim();
    const archivo = archivoInput.files[0];

    // Validaciones
    if (!validarTextoSinSimbolos(nombre)) {
      mostrarMensaje('error', 'El nombre es inválido. No uses símbolos.');
      return;
    }

    if (!archivo) {
      mostrarMensaje('error', 'Debe seleccionar una imagen.');
      return;
    }

    const reader = new FileReader();
    reader.onload = function (event) {
      // Crear fila
      const nuevaFila = document.createElement('tr');
      nuevaFila.innerHTML = `
        <td>${contadorID}</td>
        <td>${nombre}</td>
        <td><img src="${event.target.result}" width="80" height="60" class="rounded"></td>
        <td>
          <button class="btn btn-success btn-sm rounded-pill me-2" onclick="editarImagen(${contadorID})" title="Editar">
            <i class="bi bi-pencil-square"></i> Editar
          </button>
          <button class="btn btn-danger btn-sm rounded-pill" onclick="eliminarImagen(${contadorID})" title="Eliminar">
            <i class="bi bi-trash"></i> Eliminar
          </button>
        </td>
      `;
      tablaBody.appendChild(nuevaFila);
      contadorID++;

      mostrarMensaje('success', 'Imagen subida correctamente');
      form.reset();
    };
    reader.readAsDataURL(archivo);
  });
});

// Función eliminar
function eliminarImagen(id) {
  confirmarAccion('¿Estás seguro que deseas eliminar esta imagen?', () => {
    const filas = document.querySelectorAll('#imagenTableBody tr');
    filas.forEach(fila => {
      if (fila.cells[0].textContent == id) {
        fila.remove();
        mostrarMensaje('success', 'Imagen eliminada');
      }
    });
  });
}

// Función editar con modal (ejemplo simple)
function editarImagen(id) {
  Swal.fire({
    title: 'Editar Nombre de Imagen',
    input: 'text',
    inputLabel: 'Nuevo nombre',
    inputPlaceholder: 'Ej: Fiesta rosa',
    showCancelButton: true,
    confirmButtonText: 'Guardar',
    confirmButtonColor: '#28a745',
    cancelButtonColor: '#f06292',
    inputValidator: (value) => {
      if (!value) return 'Debes ingresar un nombre';
      if (!validarTextoSinSimbolos(value)) return 'Nombre inválido. Sin símbolos.';
    }
  }).then(result => {
    if (result.isConfirmed) {
      const nuevoNombre = result.value;
      const filas = document.querySelectorAll('#imagenTableBody tr');
      filas.forEach(fila => {
        if (fila.cells[0].textContent == id) {
          fila.cells[1].textContent = nuevoNombre;
          mostrarMensaje('success', 'Nombre editado con éxito');
        }
      });
    }
  });
}
