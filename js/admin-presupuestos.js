// ========== FUNCIONES DE STORAGE ==========

// Clave única para identificar los datos en el localStorage
const PRESUPUESTO_KEY = "presupuestos_data";

// INICIALIZACIÓN
function inicializarPresupuestosStorage() {
  if (!localStorage.getItem(PRESUPUESTO_KEY)) {
    const presupuestosIniciales = [
      {
        id: 1,
        cliente: "Ana García",
        email: "ana@example.com",
        telefono: "1122334455",
        evento: "Cumpleaños infantil",
        fecha: "2025-07-15",
        invitados: 30,
        salonId: 2,
        servicios: [1, 3],
        total: 12000,
        estado: "pendiente", // pendiente | aprobado | rechazado
        notas: "Tema de superhéroes"
      }
    ];
    localStorage.setItem(PRESUPUESTO_KEY, JSON.stringify(presupuestosIniciales));
  }
}

//Obtiene todos los presupuestos almacenados en localStorage, retorna vacío si no hay datos
function obtenerPresupuestos() {
    return JSON.parse(localStorage.getItem(PRESUPUESTO_KEY)) || [];
}

// Guarda la lista completa de presupuestos en localStorage.
function guardarPresupuestos(presupuestos) {
    localStorage.setItem(PRESUPUESTO_KEY, JSON.stringify(presupuestos));
}

// Muestra un mensaje de éxito, error o confirmación con SweetAlert2
function mostrarMensaje(tipo, mensaje) {
    switch(tipo) {
        case 'success':
            Swal.fire({
                icon: 'success',
                title: '¡Éxito!',
                text: mensaje,
                timer: 2000,
                showConfirmButton: false
            });
            break;
        case 'error':
            Swal.fire({
                icon: 'error',
                title: '¡Error!',
                text: mensaje,
                timer: 2000, 
                showConfirmButton: false
            });
            break;
        case 'warning':
            Swal.fire({
                icon: 'warning',
                title: '¡Advertencia!',
                text: mensaje,
                timer: 2000,
                showConfirmButton: false
            });
            break;
        case 'confirm':
            // Confirmación de eliminación
            Swal.fire({
                title: '¿Estás seguro?',
                text: mensaje,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Sí',
                cancelButtonText: 'No',
                focusCancel: true
            }).then((result) => {
                if (result.isConfirmed) {
                    // Si el usuario confirma, ejecutamos la acción de eliminación
                    eliminarPresupuesto();
                }
            });
            break;
        default:
            console.error('Tipo de mensaje no soportado');
            break;
    }
}

// ========== CRUD ==========

function crearPresupuesto(cliente, email, telefono, evento, fecha, invitados, salonId, servicios, total, estado, notas) {
    const presupuestos = obtenerPresupuestos();
    const nuevoId = presupuestos.length > 0 ? Math.max(...presupuestos.map(p => p.id)) + 1 : 1;
    const nuevoPresupuesto = {
        id: nuevoId,
        cliente,
        email,
        telefono,
        evento,
        fecha,
        invitados: parseInt(invitados),
        salonId: parseInt(salonId),
        servicios: servicios.map(s => parseInt(s)),
        total: parseFloat(total),
        estado: "pendiente", // pendiente | aprobado | rechazado
        notas
    };
    presupuestos.push(nuevoPresupuesto);
    guardarPresupuestos(presupuestos);
    mostrarMensaje('success', 'Presupuesto creado correctamente'); 
    return nuevoPresupuesto;
}

function actualizarPresupuesto(id, cliente, email, telefono, evento, fecha, invitados, salonId, servicios, total, estado, notas) {
    const presupuestos = obtenerPresupuestos();
    const index = presupuestos.findIndex(p => p.id === id);
    if (index !== -1) {
        presupuestos[index] = {
            ...presupuestos[index],
            cliente,
            email,
            telefono,
            evento,
            fecha,
            invitados: parseInt(invitados),
            salonId: parseInt(salonId),
            servicios: servicios.map(s => parseInt(s)),
            total: parseFloat(total),
            estado, // pendiente | aprobado | rechazado
            notas
        };
        guardarPresupuestos(presupuestos);
        mostrarMensaje('success', 'Presupuesto actualizado correctamente');
        return presupuestos[index];
    }
    mostrarMensaje('error', 'Hubo un error al actualizar el presupuesto'); 
    return null;
}



// ========== UI ==========
function listarPresupuestos() {
    const presupuestos = obtenerPresupuestos();
    let html = `
    <h3>Lista de Presupuestos</h3>
    <table class="table table-striped">
        <thead>
            <tr>
                <th>ID</th>
                <th>Cliente</th>
                <th>Email</th>
                <th>Teléfono</th>
                <th>Evento</th>
                <th>Fecha</th>
                <th>Invitados</th>
                <th>Salón</th>
                <th>Servicios</th>
                <th>Total</th>
                <th>Estado</th>
                <th>Notas</th>
                <th>Acciones</th>
            </tr>
        </thead>
        <tbody>`;
    presupuestos.forEach(presupuesto => {
        const salon = obtenerSalones().find(s => s.id === presupuesto.salonId);
        const servicios = obtenerServicios().filter(s => presupuesto.servicios.includes(s.id)).map(s => s.nombre).join(', ');
        html += `
        <tr>
            <td>${presupuesto.id}</td>
            <td>${presupuesto.cliente}</td>
            <td>${presupuesto.email}</td>
            <td>${presupuesto.telefono}</td>
            <td>${presupuesto.evento}</td>
            <td>${new Date(presupuesto.fecha).toLocaleDateString()}</td>
            <td>${presupuesto.invitados} personas</td>
            <td>${salon ? salon.nombre : 'N/A'}</td>
            <td>${servicios || 'Ninguno'}</td>
            <td>$${presupuesto.total.toFixed(2)}</td>
            <td>${presupuesto.estado}</td>
            <td>${presupuesto.notas || 'N/A'}</td>
            <td>
                <button class="btn btn-sm btn-warning" onclick="cargarVistaPresupuesto('presupuestos', 'editar', ${presupuesto.id})">Editar</button>
                <button class="btn btn-sm btn-danger" onclick="eliminarPresupuesto(${presupuesto.id})">Eliminar</button>
            </td>
        </tr>`;
    }
    );
    if (presupuestos.length === 0) {
        html += `<tr><td colspan="13" class="text-center">No hay presupuestos registrados</td></tr>`;
    }
    html += `</tbody></table>`;
    document.getElementById("contenido-admin").innerHTML = html;
}

function mostrarFormularioCrear(presupuesto = null) {
    const esEdicion = presupuesto !== null;
    const formHtml = `
    <h3>${esEdicion ? 'Editar' : 'Crear'} Presupuesto</h3>
    <form id="form-presupuesto" class="needs-validation" novalidate>
    <input type="hidden" id="presupuesto-id" value="${esEdicion ? presupuesto.id : ''}">
    <div class="mb-3">
        <label for="cliente" class="form-label">Cliente</label>
        <input type="text" class="form-control" id="cliente"
                value="${esEdicion ? presupuesto.cliente : ''}" required
                pattern="[A-Za-z0-9áéíóúÁÉÍÓÚñÑ\s]+">
        <div class="invalid-feedback">Por favor ingresa un nombre válido (letras, números y espacios).</div>
        <small class="text-muted">No se deben poner caracteres especiales o símbolos, solo letras (con o sin tilde), números y espacios.</small>
    </div>
    <div class="mb-3">
        <label for="email" class="form-label">Email</label>
        <input type="email" class="form-control" id="email"
                value="${esEdicion ? presupuesto.email : ''}" required>
        <div class="invalid-feedback">Por favor ingresa un email válido.</div>
        <small class="text-muted">Formato: ejemplo@dominio.com</small>
    </div>
    <div class="mb-3">
        <label for="telefono" class="form-label">Teléfono</label>
        <input type="tel" class="form-control" id="telefono"
                value="${esEdicion ? presupuesto.telefono : ''}" required
                pattern="[0-9]{10}">
        <div class="invalid-feedback">Por favor ingresa un número de teléfono válido (10 dígitos).</div>
        <small class="text-muted">Formato: 1234567890</small>
    </div>
    <div class="mb-3">
        <label for="evento" class="form-label">Evento</label>
        <input type="text" class="form-control" id="evento"
                value="${esEdicion ? presupuesto.evento : ''}" required
                pattern="[A-Za-z0-9áéíóúÁÉÍÓÚñÑ\s]+">
        <div class="invalid-feedback">Por favor ingresa un nombre de evento válido (letras, números y espacios).</div>
        <small class="text-muted">No se deben poner caracteres especiales o símbolos, solo letras (con o sin tilde), números y espacios.</small>
    </div>
    <div class="mb-3">
        <label for="fecha" class="form-label">Fecha del Evento</label>
        <input type="date" class="form-control" id="fecha"
                value="${esEdicion ? presupuesto.fecha : new Date().toISOString().split('T')[0]}" required>
        <div class="invalid-feedback">Por favor ingresa una fecha válida.</div>
        <small class="text-muted">Formato: AAAA-MM-DD</small>
    </div>
    <div class="mb-3">
        <label for="invitados" class="form-label">Número de Invitados</label>
        <input type="number" class="form-control" id="invitados"
                value="${esEdicion ? presupuesto.invitados : ''}" required min="1" max="500">
        <div class="invalid-feedback">Por favor ingresa un número de invitados válido (1-500).</div>
        <small class="text-muted">Máximo 500 invitados.</small>
    </div>
    <div class="mb-3">
        <label for="salon" class="form-label">Salón</label>
        <select class="form-select" id="salon" required>
            <option value="" disabled ${esEdicion ? '' : 'selected'}>Selecciona un salón</option>
            ${obtenerSalones().map(salon => `
            <option value="${salon.id}" ${esEdicion && presupuesto.salonId === salon.id ? 'selected' : ''}>${salon.nombre}</option>
            `).join('')}
        </select>
        <div class="invalid-feedback">Por favor selecciona un salón.</div>
        <small class="text-muted">Selecciona el salón donde se realizará el evento.</small>
    </div>
    <div class="mb-3">
        <label for="servicios" class="form-label">Servicios Adicionales</label>
        <select multiple class="form-select" id="servicios" required>
            <option value="" disabled ${esEdicion ? '' : 'selected'}>Selecciona servicios</option>
            ${obtenerServicios().map(servicio => `
            <option value="${servicio.id}" ${esEdicion && presupuesto.servicios.includes(servicio.id) ? 'selected' : ''}>${servicio.nombre} - $${servicio.precio.toFixed(2)}</option>
            `).join('')}
        </select>
        <div class="invalid-feedback">Por favor selecciona al menos un servicio.</div>
        <small class="text-muted">Puedes seleccionar múltiples servicios manteniendo presionada la tecla Ctrl (o Cmd en Mac).</small>
    </div>
    <div class="mb-3">
        <label for="total" class="form-label">Total Estimado</label>
        <input type="number" step="0.01" class="form-control" id="total"
                value="${esEdicion ? presupuesto.total.toFixed(2) : ''}" readonly disabled>
    </div>
    <div class="mb-3">
        <label for="estado" class="form-label">Estado del Presupuesto</label>
        <select class="form-select" id="estado" required ${esEdicion ? '' : 'disabled'}>
            <option value="pendiente" ${esEdicion && presupuesto.estado === 'pendiente' ? 'selected' : ''}>Pendiente</option>
            <option value="aprobado" ${esEdicion && presupuesto.estado === 'aprobado' ? 'selected' : ''}>Aprobado</option>
            <option value="rechazado" ${esEdicion && presupuesto.estado === 'rechazado' ? 'selected' : ''}>Rechazado</option>
        </select>
        <div class="invalid-feedback">Por favor selecciona un estado.</div>
        <small class="text-muted">Selecciona el estado actual del presupuesto.</small>
    </div>
    <div class="mb-3">
        <label for="notas" class="form-label">Notas Adicionales</label>
        <textarea class="form-control" id="notas" rows="3">${esEdicion ? presupuesto.notas : ''}</textarea>
        <div class="invalid-feedback">Por favor ingresa notas adicionales si es necesario.</div>
        <small class="text-muted">Puedes agregar cualquier información relevante sobre el presupuesto.</small>
    </div>
    <button type="submit" class="btn btn-primary">${esEdicion ? 'Actualizar' : 'Guardar'}</button>
    </form>`;
    const contenidoAdmin = document.getElementById("contenido-admin");
    if (contenidoAdmin) {
        contenidoAdmin.innerHTML = formHtml;
    }
    const form = document.getElementById("form-presupuesto");
    // Evento de submit
    form.addEventListener('submit', function(e) {
        e.preventDefault();

        const cliente = document.getElementById('cliente').value.trim();
        const email = document.getElementById('email').value.trim();
        const telefono = document.getElementById('telefono').value.trim();
        const evento = document.getElementById('evento').value.trim();
        const fecha = document.getElementById('fecha').value;
        const invitados = document.getElementById('invitados').value;
        const salonId = parseInt(document.getElementById('salon').value);
        const serviciosSeleccionados = Array.from(document.getElementById('servicios').selectedOptions).map(option => parseInt(option.value));
        const total = document.getElementById('total').value;
        const estado = document.getElementById('estado').value;
        const notas = document.getElementById('notas').value.trim();

        // Validaciones
        if (!cliente || !email || !telefono || !evento || !fecha || !invitados || !salonId || serviciosSeleccionados.length === 0 || !total) {
            mostrarMensaje('error', 'Por favor completa todos los campos obligatorios');
            return;
        }

        if (isNaN(parseInt(invitados)) || parseInt(invitados) < 1 || parseInt(invitados) > 500) {
            mostrarMensaje('error', 'El número de invitados debe ser un número entre 1 y 500');
            return;
        }

        const id = document.getElementById('presupuesto-id').value;

        if (esEdicion) {
            actualizarPresupuesto(parseInt(id), cliente, email, telefono, evento, fecha, invitados, salonId, serviciosSeleccionados, total, estado, notas);
            mostrarMensaje('success', 'Presupuesto actualizado correctamente');
        } else {
            crearPresupuesto(cliente, email, telefono, evento, fecha, invitados, salonId, serviciosSeleccionados, total, estado, notas);
            mostrarMensaje('success', 'Presupuesto creado correctamente');
        }
        listarPresupuestos();
    });

  function calcularTotal() {
    const salonId = parseInt(document.getElementById('salon').value);
    const serviciosSeleccionados = Array.from(document.getElementById('servicios').selectedOptions).map(option => parseInt(option.value));

    let totalSalon = 0;
    let totalServicios = 0;

    const salon = obtenerSalones().find(s => s.id === salonId);
    if (salon) {
        totalSalon = salon.precio;
    }

    const servicios = obtenerServicios().filter(s => serviciosSeleccionados.includes(s.id));
    totalServicios = servicios.reduce((acc, s) => acc + s.precio, 0);

    const total = totalSalon + totalServicios;
    document.getElementById('total').value = total.toFixed(2);
  }

  // Agregar eventos para actualizar el total automáticamente
  document.getElementById('salon').addEventListener('change', calcularTotal);
  document.getElementById('servicios').addEventListener('change', calcularTotal);

  // Calcular total al cargar (si es creación, no edición)
  if (!esEdicion) {
      calcularTotal();
  }
}

function mostrarFormularioEditar(id) {
    const presupuestos = obtenerPresupuestos();
    const presupuesto = presupuestos.find(p => p.id === parseInt(id));
    if (presupuesto) {
        mostrarFormularioCrear(presupuesto);
    } else {
        alert("Presupuesto no encontrado");
        listarPresupuestos();
    }
}

// ========== GLOBAL ==========
function cargarVistaPresupuesto(categoria, accion, id = null) {
    if (categoria === 'presupuestos') {
        if (accion === 'listar') {
            listarPresupuestos();
        } else if (accion === 'crear') {
            mostrarFormularioCrear();
        } else if (accion === 'editar') {
            mostrarFormularioEditar(id);
        }
    }
}

function eliminarPresupuesto(id) {
    Swal.fire({
        title: '¿Estás seguro?',
        text: "¡Este presupuesto será eliminado permanentemente!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'No, cancelar',
        reverseButtons: true
    }).then((result) => {
        if (result.isConfirmed) {
            // Eliminar el presupuesto
            const presupuestos = obtenerPresupuestos().filter(presupuesto => presupuesto.id !== id);
            guardarPresupuestos(presupuestos);
            listarPresupuestos();
            mostrarMensaje('success', 'Presupuesto eliminado con éxito');
        }
        else {
          Swal.fire(
              'Cancelado',
              'El presupuesto no fue eliminado.',
              'error'
          );
      }
    });
}

function renderizarPresupuestos() {
    const presupuestos = obtenerPresupuestos();
    const contenedor = document.getElementById("presupuestos-container");
    contenedor.innerHTML = "";
    presupuestos.forEach(presupuesto => {
        const salon = obtenerSalones().find(s => s.id === presupuesto.salonId);
        const servicios = obtenerServicios().filter(s => presupuesto.servicios.includes(s.id)).map(s => s.nombre).join(', ');
        contenedor.innerHTML += `
        <div class="col">
            <div class="card h-100 shadow">
                <div class="card-body">
                    <h5 class="card-title">${presupuesto.cliente}</h5>
                    <p class="card-text">Evento: ${presupuesto.evento}</p>  
                    <p class="card-text">Fecha: ${new Date(presupuesto.fecha).toLocaleDateString()}</p>
                    <p class="card-text">Invitados: ${presupuesto.invitados} personas</p>
                    <p class="card-text">Salón: ${salon ? salon.nombre : 'N/A'}</p>
                    <p class="card-text">Servicios: ${servicios || 'Ninguno'}</p>
                    <p class="fw-bold">Total: $${presupuesto.total.toFixed(2)}</p>
                    <p class="card-text">Estado: ${presupuesto.estado}</p>
                    <p class="card-text">Notas: ${presupuesto.notas || 'N/A'}</p>
                    <button class="btn btn-sm btn-warning" onclick="cargarVistaPresupuesto('presupuestos', 'editar', ${parseInt(presupuesto.id)})">Editar</button>
                    <button class="btn btn-sm btn-danger" onclick="eliminarPresupuesto(${presupuesto.id})">Eliminar</button>
                </div>
            </div>
        </div>
        `;
    });
    if (presupuestos.length === 0) {
        contenedor.innerHTML = `<p class="text-center">No hay presupuestos registrados</p>`;
    }
}


// Hacer funciones accesibles globalmente
window.cargarVistaPresupuesto = cargarVistaPresupuesto;
window.eliminarPresupuesto = eliminarPresupuesto;
window.listarPresupuestos = listarPresupuestos;
        
    
