// ========== FUNCIONES DE STORAGE ==========
const SERVICIOS_KEY = 'servicios_data';

// Función para obtener la lista de servicios desde localStorage
function obtenerServicios() {
  const servicios = localStorage.getItem(SERVICIOS_KEY);
  return servicios ? JSON.parse(servicios) : [];
}

// Función para asignar un ID único y secuencial
function obtenerNuevoId() {
  const servicios = obtenerServicios();
  return servicios.length > 0 ? servicios[servicios.length - 1].id + 1 : 1;
}

// Función para agregar un nuevo servicio con un ID secuencial
function agregarServicio(nombre, tiempo, precio, imagen) {
  const servicios = obtenerServicios();
  const nuevoServicio = {
    id: obtenerNuevoId(),
    nombre,
    tiempo: Math.min(tiempo, 12) + " horas", // Limitar el tiempo a un máximo de 12 horas
    precio,
    imagen
  };
  servicios.push(nuevoServicio);
  localStorage.setItem(SERVICIOS_KEY, JSON.stringify(servicios));
  listarServicios();
}

// Función para mostrar la lista de servicios
function listarServicios() {
  const servicios = obtenerServicios();
  const serviciosBody = document.getElementById('servicios-body');
  
  if (!serviciosBody) {
    console.error('El contenedor "servicios-body" no se encuentra en el DOM.');
    return;
  }

  if (servicios.length === 0) {
    serviciosBody.innerHTML = '<tr><td colspan="5">No hay servicios disponibles.</td></tr>';
    return;
  }

  let filasServicios = '';
  servicios.forEach(servicio => {
    filasServicios += `
      <tr>
        <td>${servicio.id}</td>
        <td>${servicio.nombre}</td>
        <td>${servicio.tiempo}</td>
        <td>${servicio.precio}</td>
        <td>
          <button class="btn btn-edit" onclick="confirmarAccion('editar', ${servicio.id})">Editar</button>
          <button class="btn btn-delete" onclick="confirmarAccion('eliminar', ${servicio.id})">Eliminar</button>
        </td>
      </tr>
    `;
  });

  serviciosBody.innerHTML = filasServicios;
}

// Función para confirmar la acción de editar o eliminar
function confirmarAccion(accion, id) {
  if (accion === 'editar') {
    Swal.fire({
      title: "¿Estás seguro de editar este servicio?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí, editar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#28a745"
    }).then((result) => {
      if (result.isConfirmed) {
        // Redirigir al formulario de edición
        window.location.href = `/pages/admin/forms/form-servicio.html?id=${id}`;
      }
    });
  } else if (accion === 'eliminar') {
    Swal.fire({
      title: "¿Estás seguro de eliminar este servicio?",
      text: "No podrás revertir esta acción.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#dc3545"
    }).then((result) => {
      if (result.isConfirmed) {
        eliminarServicio(id);
        Swal.fire("Eliminado!", "El servicio ha sido eliminado.", "success");
      }
    });
  }
}

// Función para eliminar un servicio
function eliminarServicio(id) {
  const servicios = obtenerServicios();
  const nuevosServicios = servicios.filter(servicio => servicio.id !== id);
  localStorage.setItem(SERVICIOS_KEY, JSON.stringify(nuevosServicios));
  listarServicios();
}

// Función para cargar la vista de servicios
function cargarVistaServicios() {
  listarServicios();
}

// Inicializar la lista de servicios
document.addEventListener('DOMContentLoaded', () => {
  cargarVistaServicios();
});

// Servicios de ejemplo
const serviciosDeEjemplo = [
  { id: 1, nombre: 'Decoración temática', tiempo: '5 horas', precio: '$5000.00', imagen: 'https://via.placeholder.com/80' },
  { id: 2, nombre: 'Animación para todas las edades', tiempo: '2 horas', precio: '$6500.00', imagen: 'https://via.placeholder.com/80' },
  { id: 3, nombre: 'Catering', tiempo: '5 horas', precio: '$8500.00', imagen: 'https://via.placeholder.com/80' }
];

// Si no existen datos en localStorage, guardamos estos servicios de ejemplo
if (!localStorage.getItem(SERVICIOS_KEY)) {
  localStorage.setItem(SERVICIOS_KEY, JSON.stringify(serviciosDeEjemplo));
}
