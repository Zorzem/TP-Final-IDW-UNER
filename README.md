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