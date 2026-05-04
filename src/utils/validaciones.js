/**
 * utils/validaciones.js
 * Funciones de validación para el formulario de reservas.
 */

/**
 * Valida los datos de una reserva antes de enviarlos a Supabase.
 * @param {Object} reserva
 * @returns {{ valido: boolean, errores: Object }}
 */
export function validarReserva(reserva) {
  const errores = {}

  if (!reserva.cliente_nombre?.trim()) {
    errores.cliente_nombre = 'El nombre es obligatorio.'
  }

  if (!reserva.cliente_tel?.trim() && !reserva.cliente_email?.trim()) {
    errores.contacto = 'Debes ingresar al menos teléfono o correo.'
  }

  if (reserva.cliente_email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(reserva.cliente_email)) {
    errores.cliente_email = 'Correo electrónico inválido.'
  }

  if (!reserva.fecha) {
    errores.fecha = 'La fecha es obligatoria.'
  }

  if (!reserva.hora) {
    errores.hora = 'La hora es obligatoria.'
  }

  if (!reserva.num_personas || reserva.num_personas < 1) {
    errores.num_personas = 'Debe haber al menos 1 persona.'
  }

  if (!reserva.mesa_id) {
    errores.mesa_id = 'Debes seleccionar una mesa.'
  }

  return {
    valido: Object.keys(errores).length === 0,
    errores,
  }
}
