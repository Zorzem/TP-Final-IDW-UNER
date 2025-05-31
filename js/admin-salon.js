// ========== CONSTANTES ==========

// Clave única para identificar los datos en el localStorage
const STORAGE_KEY = "salones_data";

// ========== FUNCIONES DE STORAGE ==========

/**
 * Inicializa el localStorage con datos de ejemplo, creando 9 salones de prueba.
 */
function inicializarLocalStorage() {
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


// ========== FUNCIONES DE SALONES ==========

/**
 * Obtiene todos los salones almacenados en localStorage, retorna vacío si no hay datos
 */
function obtenerSalones() {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
}

/**
 * Guarda la lista completa de salones en localStorage.
 */
function guardarSalones(salones) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(salones));
}

// ========== CRUD ==========

function crearSalon(nombre, capacidad, precio, imagen) {
    const salones = obtenerSalones();
    const nuevoId = salones.length > 0 ? Math.max(...salones.map(s => s.id)) + 1 : 1;
    const nuevoSalon = {
        id: nuevoId,
        nombre,
        capacidad: parseInt(capacidad),
        precio: parseFloat(precio),
        imagen
    };
    salones.push(nuevoSalon);
    guardarSalones(salones);
    return nuevoSalon;
}

function actualizarSalon(id, nombre, capacidad, precio, imagen) {
    const salones = obtenerSalones();
    const index = salones.findIndex(s => s.id === id);
    if (index !== -1) {
        salones[index] = {
            ...salones[index],
            nombre,
            capacidad: parseInt(capacidad),
            precio: parseFloat(precio),
            imagen
        };
        guardarSalones(salones);
        return salones[index];
    }
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
    
    salones.forEach(salon => {
        html += `
        <tr>
            <td>${salon.id}</td>
            <td>${salon.nombre}</td>
            <td>${salon.capacidad} personas</td>
            <td>$${salon.precio.toFixed(2)}</td>
            <td>${salon.imagen}</td>
            <td>
                <button class="btn btn-sm btn-warning" onclick="cargarVista('salones', 'editar', ${salon.id})">Editar</button>
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
    <h3>${esEdicion ? 'Editar' : 'Crear'} Salón</h3>
    <form id="form-salones" class="needs-validation" novalidate>
        <input type="hidden" id="salon-id" value="${esEdicion ? salon.id : ''}">
        <div class="mb-3">
            <label for="nombre" class="form-label">Nombre</label>
            <input type="text" class="form-control" id="nombre" 
                   value="${esEdicion ? salon.nombre : ''}" required>
            <div class="invalid-feedback">Por favor ingresa un nombre</div>
        </div>
        <div class="mb-3">
            <label for="capacidad" class="form-label">Capacidad</label>
            <input type="number" class="form-control" id="capacidad" 
                   value="${esEdicion ? salon.capacidad : ''}" required min="1">
            <div class="invalid-feedback">Por favor ingresa la capacidad</div>
        </div>
        <div class="mb-3">
            <label for="precio" class="form-label">Precio</label>
            <input type="number" step="0.01" class="form-control" id="precio" 
                   value="${esEdicion ? salon.precio : ''}" required min="0.01">
            <div class="invalid-feedback">Por favor ingresa el precio</div>
        </div>
        <div class="mb-3">
            <label for="imagen" class="form-label">Nombre de Imagen</label>
            <input type="text" class="form-control" id="imagen" 
                   value="${esEdicion ? salon.imagen : ''}" required>
            <div class="invalid-feedback">Por favor ingresa el nombre de la imagen</div>
        </div>
        <button type="submit" class="btn btn-primary">${esEdicion ? 'Actualizar' : 'Guardar'}</button>
    </form>`;
    
    document.getElementById("contenido-admin").innerHTML = formHtml;
    
    const form = document.getElementById("form-salones");
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        if (!form.checkValidity()) {
            e.stopPropagation();
            form.classList.add('was-validated');
            return;
        }
        
        const id = document.getElementById('salon-id').value;
        const nombre = document.getElementById('nombre').value;
        const capacidad = document.getElementById('capacidad').value;
        const precio = document.getElementById('precio').value;
        const imagen = document.getElementById('imagen').value;
        
        if (esEdicion) {
            actualizarSalon(parseInt(id), nombre, capacidad, precio, imagen);
            alert("Salón actualizado correctamente");
        } else {
            crearSalon(nombre, capacidad, precio, imagen);
            alert("Salón creado correctamente");
        }
        
        listarSalones();
    });
}

function mostrarFormularioEditar(id) {
    const salones = obtenerSalones();
    const salon = salones.find(s => s.id === id);
    if (salon) {
        mostrarFormularioCrear(salon);
    } else {
        alert("Salón no encontrado");
        listarSalones();
    }
}

// ========== GLOBAL ==========
function cargarVista(categoria, accion, id = null) {
    if (categoria === 'salones') {
        if (accion === 'listar') {
            listarSalones();
        } else if (accion === 'crear') {
            mostrarFormularioCrear();
        } else if (accion === 'editar') {
            mostrarFormularioEditar(id);
        }
    }
}

function eliminarSalon(id) {
    if (confirm("Deseas eliminar este salón?")) {
        const salones = obtenerSalones().filter(salon => salon.id !== id);
        guardarSalones(salones);
        listarSalones();
        alert("Salón eliminado.");
    }
}

// ========== INICIALIZACIÓN ==========

// Inicializa localStorage al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    inicializarLocalStorage();
});

// Hacer funciones accesibles globalmente
window.cargarVista = cargarVista;
window.eliminarSalon = eliminarSalon;
window.listarSalones = listarSalones;