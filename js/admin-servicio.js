// ========== FUNCIONES DE STORAGE ==========

// Clave única para los servicios
const SERVICIOS_STORAGE_KEY = "servicios_data";

// Inicializa el almacenamiento local con datos de ejemplo si está vacío
function inicializarLocalStorageServicios() {
    if (!localStorage.getItem(SERVICIOS_STORAGE_KEY)) {
        const serviciosIniciales = [
            { id: 1, nombre: "Decoracion tematica", tiempo_hs: 5, precio: 5000, imagen: "icon1.png" },
            { id: 2, nombre: "Animación para todas las edades", tiempo_hs: 2, precio: 6500, imagen: "icon2.png" },
            { id: 3, nombre: "Catering", tiempo_hs: 5, precio: 8500, imagen: "icon3.png" }
        ];
        localStorage.setItem(SERVICIOS_STORAGE_KEY, JSON.stringify(serviciosIniciales));
    }
}

// Obtiene todos los servicios almacenados en localStorage
function obtenerServicios() {
    return JSON.parse(localStorage.getItem(SERVICIOS_STORAGE_KEY)) || [];
}

// Guarda la lista completa de servicios en localStorage
function guardarServicios(servicios) {
    localStorage.setItem(SERVICIOS_STORAGE_KEY, JSON.stringify(servicios));
}

/* ———————————————————————————————————————————————————————————————————————————————————— */

// ========== CRUD ==========

// Crea un nuevo servicio
function crearServicio(nombre, tiempo_hs, precio, imagen) {
    const servicios = obtenerServicios();
    const nuevoId = servicios.length > 0 ? Math.max(...servicios.map(s => s.id)) + 1 : 1;
    const nuevoServicio = {
        id: nuevoId,
        nombre,
        tiempo_hs: parseInt(tiempo_hs),
        precio: parseFloat(precio),
        imagen
    };
    servicios.push(nuevoServicio);
    guardarServicios(servicios);
    return nuevoServicio;
}

// Actualiza un servicio existente
function actualizarServicio(id, nombre, tiempo_hs, precio, imagen) { 
    const servicios = obtenerServicios();
    const index = servicios.findIndex(s => s.id === id);
    if (index !== -1) {
        servicios[index] = {
            ...servicios[index],
            nombre,
            tiempo_hs: parseInt(tiempo_hs),
            precio: parseFloat(precio),
            imagen
        };
        guardarServicios(servicios);
        return servicios[index];
    }
    return null;
}

// Elimina un servicio
function eliminarServicio(id) {
    if (confirm("¿Estás seguro de eliminar este servicio?")) {
        const servicios = obtenerServicios().filter(servicio => servicio.id !== id);
        guardarServicios(servicios);
        listarServicios();
        alert("Servicio eliminado correctamente");
    }
}

// ========== UI ==========

// Muestra la lista de servicios
function listarServicios() {
    const servicios = obtenerServicios();
    let html = `
    <h3>Lista de Servicios</h3>
    <table class="table table-striped">
        <thead>
            <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Tiempo (hs)</th>
                <th>Precio</th>
                <th>Imagen</th>
                <th>Acciones</th>
            </tr>
        </thead>
        <tbody>`;
    
    servicios.forEach(servicio => { 
        html += `
        <tr>
            <td>${servicio.id}</td>
            <td>${servicio.nombre}</td>
            <td>${servicio.tiempo_hs} horas</td>
            <td>$${servicio.precio.toFixed(2)}</td>
            <td>${servicio.imagen}</td>
            <td>
                <button class="btn btn-sm btn-warning" onclick="cargarVistaServicios('servicios', 'editar', ${servicio.id})">Editar</button>
                <button class="btn btn-sm btn-danger" onclick="eliminarServicio(${servicio.id})">Eliminar</button>
            </td>
        </tr>`;
    });
    
    html += `</tbody></table>`;
    document.getElementById("contenido-admin").innerHTML = html;
}

// Muestra el formulario para crear o editar un servicio
function mostrarFormularioCrearServicio(servicio = null) {
    const esEdicion = servicio !== null;
    const formHtml = `
    <h3>${esEdicion ? 'Editar' : 'Crear'} Servicio</h3>
    <form id="form-servicios" class="needs-validation" novalidate>
        <input type="hidden" id="servicio-id" value="${esEdicion ? servicio.id : ''}">
        <div class="mb-3">
            <label for="nombre" class="form-label">Nombre</label>
            <input type="text" class="form-control" id="nombre" 
                   value="${esEdicion ? servicio.nombre : ''}" required> 
            <div class="invalid-feedback">Por favor ingresa un nombre</div>
        </div>
        <div class="mb-3">
            <label for="tiempo_hs" class="form-label">Tiempo (horas)</label> 
            <input type="number" class="form-control" id="tiempo_hs" max="12"  
                   value="${esEdicion ? servicio.tiempo_hs : ''}" required min="1">
            <div class="invalid-feedback">Por favor ingresa el tiempo</div>
        </div>
        <div class="mb-3">
            <label for="precio" class="form-label">Precio</label>
            <input type="number" step="0.01" class="form-control" id="precio" 
                   value="${esEdicion ? servicio.precio : ''}" required min="0.01">
            <div class="invalid-feedback">Por favor ingresa el precio</div>
        </div>
        <div class="mb-3">
            <label for="imagen" class="form-label">Nombre de Imagen</label>
            <input type="text" class="form-control" id="imagen" 
                   value="${esEdicion ? servicio.imagen : ''}" required>
            <div class="invalid-feedback">Por favor ingresa el nombre de la imagen</div>
        </div>
        <button type="submit" class="btn btn-primary">${esEdicion ? 'Actualizar' : 'Guardar'}</button>
    </form>`;
    
    document.getElementById("contenido-admin").innerHTML = formHtml;
    
    const form = document.getElementById("form-servicios");
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        if (!form.checkValidity()) {
            e.stopPropagation();
            form.classList.add('was-validated');
            return;
        }
        
        const id = document.getElementById('servicio-id').value;
        const nombre = document.getElementById('nombre').value; 
        const tiempo_hs = document.getElementById('tiempo_hs').value;
        const precio = document.getElementById('precio').value;
        const imagen = document.getElementById('imagen').value;
        
        if (esEdicion) {
            actualizarServicio(parseInt(id), nombre, tiempo_hs, precio, imagen);
            alert("Servicio actualizado correctamente");
        } else {
            crearServicio(nombre, tiempo_hs, precio, imagen);
            alert("Servicio creado correctamente");
        }
        
        listarServicios();
    });
}

// Muestra el formulario para editar un servicio
function mostrarFormularioEditarServicio(id) {
    const servicios = obtenerServicios();
    const servicio = servicios.find(s => s.id === id);
    if (servicio) {
        mostrarFormularioCrearServicio(servicio);
    } else {
        alert("Servicio no encontrado");
        listarServicios();
    }
}

// ========== GLOBAL ==========

// Maneja las vistas para servicios
function cargarVistaServicios(categoria, accion, id = null) {
    if (categoria === 'servicios') {
        if (accion === 'listar') {
            listarServicios();
        } else if (accion === 'crear') {
            mostrarFormularioCrearServicio();
        } else if (accion === 'editar') {
            mostrarFormularioEditarServicio(id);
        }
    }
}


// Función para mostrar los servicios en el catálogo
function renderizarServicios() {
    const servicios = obtenerServicios();
    const container = document.getElementById('servicios-container');
    container.innerHTML = ''; // Limpiar antes de renderizar
    
    // Generar una card por cada servicio
    servicios.forEach(servicio => {
        const cardHtml = `
        <div class="col">
            <div class="card h-100 shadow">
                <img src="img/${servicio.imagen}" class="card-img-top border border-2 border-white" alt="${servicio.nombre}" />
                <div class="card-body">
                    <h5 class="card-title">${servicio.nombre}</h5>
                    <p class="card-text">Duración: ${servicio.tiempo_hs} horas</p>
                    <p class="fw-bold">$${servicio.precio.toFixed(2)}</p>
                </div>
            </div>
        </div>`;
        
        container.insertAdjacentHTML('beforeend', cardHtml);
    });
}


// ========== INICIALIZACIÓN ==========

// Inicializa localStorageServicios al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    inicializarLocalStorageServicios();
});

// Hacer funciones accesibles globalmente
window.cargarVistaServicios = cargarVistaServicios;
window.eliminarServicio = eliminarServicio;
window.listarServicios = listarServicios;
window.renderizarServicios = renderizarServicios;