# Trabajo Final Integrador – Introducción al Desarrollo Web

## Tecnicatura Universitaria en Desarrollo Web  
**Facultad de Ciencias de la Administración – UNER**  
**Primer cuatrimestre 2025**

## Materia  
**Introducción al Desarrollo Web**

## Integrantes del grupo (Usuario Github)
- **Boris Kovalow (Zorzem)**
- **Giuliano Daniele (Vitruviansky)** 
- **Jose Herrera (joseherreraa1)**
- **Matias Godoy (Kbzgames)**
- **Virginia Alejandra Ponce (CodeGinny)**

---

## Primera Entrega – Etapa 1

### Objetivos de esta entrega

Esta primera etapa del trabajo tiene como objetivos:

- Aplicar los conocimientos adquiridos sobre **HTML** y **CSS** durante la cursada.
- Definir la **estructura base** de la aplicación web que será utilizada como base para el desarrollo completo del Trabajo Final Integrador.
- Aplicar un **estilo visual coherente y adaptado** a dicha estructura.

### Páginas entregadas

Hasta el momento, el sitio cuenta con las siguientes páginas:

- **Inicio o Portada:** página principal de bienvenida al sitio.
- **Información institucional:** breve descripción de la empresa ficticia **IDW S.A.** y su propósito.
- **Contacto:** formulario o información básica para contacto (con diseño estático).

---

## Segunda Entrega – Etapa 2

### Objetivos de esta entrega

En esta segunda etapa se profundiza la estructura del sitio web implementando buenas prácticas de desarrollo moderno. Los objetivos fueron:

- Reestructurar el HTML utilizando **etiquetas semánticas** de HTML5.
- Integrar el framework **Bootstrap 5** para mejorar el diseño visual y la adaptabilidad.
- Optimizar la **navegación del sitio** mediante una barra de navegación funcional y adaptable a dispositivos móviles.
- Incorporar una **sección de catálogo** de salones de eventos utilizando **Flexbox** y/o **Grid**, con imágenes, descripciones y estilo visual uniforme.

### Cambios realizados

- Se reemplazaron estilos propios de CSS por **clases nativas de Bootstrap 5**, incluyendo:
  - Sistema de grillas (`container`, `row`, `col`).
  - Espaciados (`mt-4`, `p-3`, etc.).
  - Botones (`btn`, `btn-primary`, etc.).
  - Utilidades de diseño (`text-center`, `d-flex`, etc.).

- Se implementó una **barra de navegación responsive** utilizando componentes de Bootstrap, incluyendo:
  - Botón *toggle* funcional en dispositivos móviles.
  - Enlaces hacia todas las secciones principales del sitio (Inicio, Institucional, Catálogo, Contacto).

- Se creó un **catálogo visual de salones de eventos**:
  - Utilizando **Flexbox** y/o **Bootstrap Grid** para organizar las tarjetas.
  - Cada salón incluye imagen, nombre, descripción breve y detalles visuales.

### Páginas actualizadas o incorporadas

- **index.html (Inicio):** rediseñada con estructura semántica, navegación Bootstrap y sección de catálogo.
- **institucional.html:** rediseñada usando etiquetas semánticas (`section`, `article`) y clases de Bootstrap.
- **contacto.html:** incluye formulario estático estilizado con Bootstrap y maquetado responsive.
- **style.css:** reducido y reorganizado para trabajar en conjunto con las clases de Bootstrap, manteniendo solo los estilos personalizados necesarios.

---

## Tercera Entrega – Etapa 3

### Objetivos de esta entrega

En esta etapa se desarrollaron funcionalidades dinámicas de administración para los salones de eventos, incorporando lógica en JavaScript y almacenamiento permanente usando la API de `LocalStorage`. Los objetivos fueron:

- Implementar operaciones de **Crear, Leer, Modificar y Eliminar (CRUD)** para los salones, servicios e imágenes.
- Persistir datos en el navegador utilizando `LocalStorage`.
- Mostrar los salones, servicios e imágenes en una **tabla HTML** dinámica.
- Usar **formularios HTML apropiados** para la creación y edición.
- Simular la carga de imágenes, convirtiéndolas a **Base64** para su almacenamiento local.
- Actualizar el catálogo para mostrar los datos desde `LocalStorage` en lugar de estar codificados manualmente.

---

### Funcionalidades implementadas

- Se crearon los archivos `admin-salon.js`, `admin-servicio.js` y `admin-imagen.js` cada una con una constante `KEY` que define los valores por defecto. Estos archivos se importan en el script principal para inicializar el `LocalStorage` si no hay datos guardados previamente.
- Los salones, servicios e imágenes se administran desde una sección `ADMIN` que cuenta con una tabla HTML donde pueden:
  - **Visualizarse** con sus datos básicos e imagen miniatura.
  - **Crearse** desde un formulario dinámico.
  - **Editarse**, cargando los datos al formulario.
  - **Eliminarse**, con confirmación del usuario.
- Las imágenes cargadas mediante un campo `input[type="file"]` se convierten a Base64 utilizando `FileReader`, y se guardan como string dentro del objeto del salón en `LocalStorage`.
- Todos los campos del formulario fueron validados según el tipo de dato correspondiente (texto, número, archivo, etc.).
- Tanto el catálogo de salones como el de servicios y galeria de imágenes dentro del archivo `index.html` fueron modificados para **cargar dinámicamente los datos desde `LocalStorage`**, generando cada tarjeta de manera automática con los datos almacenados.

---

## Cuarta Entrega – Etapa 4

### Objetivos de esta entrega

Esta etapa tiene como objetivo incorporar una **autenticación real vía API REST pública**, restringir el acceso al panel administrativo y completar el sistema de administración con todas las funcionalidades necesarias. Los objetivos fueron:

- Implementar la funcionalidad de **inicio de sesión de usuario** utilizando la API REST pública de [DummyJSON](https://dummyjson.com).
- Restringir el acceso al panel de administración a usuarios autenticados.
- Persistir el **accessToken** en `sessionStorage` para identificar la sesión activa.
- Incorporar una nueva página dentro del panel de administración que muestre los **usuarios registrados** en la API pública.
- Completar las funcionalidades **CRUD** para todas las entidades del sistema (salones, servicios, imágenes y presupuestos).
- Implementar la funcionalidad de **presupuestos** como una nueva entidad administrable.

### Funcionalidades implementadas

- Se creó una nueva página `login.html` con un formulario de autenticación de usuario.
  - El formulario envía los datos a `https://dummyjson.com/auth/login` mediante `fetch`.
  - Si las credenciales son válidas, se guarda el `accessToken` en `sessionStorage`.
  - En caso de error, se muestra un mensaje adecuado al usuario.
  - **Ejemplo de usuario válido:**
    - Usuario: `emilys`
    - Contraseña: `emilyspass`

- Se implementó un **control de acceso** al panel de administración:
  - Si el usuario no está logueado (no hay token en `sessionStorage`), se redirige automáticamente a `login.html`.
  - El token se borra al cerrar sesión o al eliminarlo manualmente.

- Se agregó una nueva página `admin-usuarios.html` que lista todos los usuarios públicos desde `https://dummyjson.com/users`.
  - Los datos sensibles fueron omitidos (contraseñas, tokens, etc.).
  - La vista es únicamente de **lectura** (listado simple).

- Se implementó una nueva sección para la **administración de presupuestos**:
  - CRUD completo: **Crear, Leer, Editar y Eliminar presupuestos**.
  - Los datos se almacenan de forma persistente utilizando `localStorage`.
  - Se incluyen campos como nombre del cliente, fecha, servicios seleccionados, y total estimado.
  - Validación completa de campos y experiencia de usuario amigable.

- El panel de administración ahora ofrece acceso completo y funcional a:
  - **Salones**
  - **Servicios**
  - **Imágenes**
  - **Presupuestos**
  - **Usuarios registrados (API pública)**

- **Link video explicativo:** [Video](https://drive.google.com/file/d/1yntjEpOogRCu4fe91ZsRav604ftIleX5).

---