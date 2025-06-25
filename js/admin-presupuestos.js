// ========== FUNCIONES DE STORAGE ==========

// Clave única para identificar los datos en el localStorage
const STORAGE_KEY = "presupuestos_data";

// INICIALIZACIÓN
function inicializarPresupuestosStorage() {
  if (!localStorage.getItem(PRESUPUESTOS_KEY)) {
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
    localStorage.setItem(PRESUPUESTOS_KEY, JSON.stringify(presupuestosIniciales));
  }
}