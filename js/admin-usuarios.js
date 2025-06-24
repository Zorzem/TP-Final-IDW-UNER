function listarUsuarios() {
  fetch('https://dummyjson.com/users')
    .then(res => res.json())
    .then(data => {
      const usuarios = data.users;

      let html = `
        <h3>Usuarios Registrados</h3>
        <table class="table table-striped">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Email</th>
              <th>País</th>
              <th>Teléfono</th>
            </tr>
          </thead>
          <tbody>`;

      usuarios.forEach(user => {
        html += `
          <tr>
            <td>${user.id}</td>
            <td>${user.firstName} ${user.lastName}</td>
            <td>${user.email}</td>
            <td>${user.address?.country || ''}</td>
            <td>${user.phone}</td>
          </tr>`;
      });

      html += `</tbody></table>`;
      document.getElementById("contenido-admin").innerHTML = html;
    })
    .catch(err => {
      console.error("Error al obtener usuarios:", err);
      document.getElementById("contenido-admin").innerHTML = "<p>Error al cargar usuarios.</p>";
    });
}


if (!window.__vistaExtendidaUsuarios) {
  const cargarAnterior = window.cargarVista || function () {};

  window.cargarVista = function (categoria, accion, id = null) {
    if (categoria === 'usuarios' && accion === 'listar') {
      listarUsuarios();
    } else {
      cargarAnterior(categoria, accion, id);
    }
  };

  window.__vistaExtendidaUsuarios = true;
}

