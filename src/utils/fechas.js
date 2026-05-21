/**
 * utils/fechas.js
 * Funciones auxiliares para manejo y formateo de fechas y horas.
 */

const DIAS = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado']

/**
 * Retorna el nombre del día de la semana en español para una fecha dada.
 * @param {string|Date} fecha - Fecha en formato 'YYYY-MM-DD' o Date
 * @returns {string} - 'lunes' | 'martes' | ... | 'domingo'
 */
export function getDiaSemana(fecha) {
  const d = typeof fecha === 'string' ? new Date(fecha + 'T00:00:00') : fecha
  return DIAS[d.getDay()]
}

/**
 * Formatea una fecha 'YYYY-MM-DD' a texto legible en español.
 * Ej: '2024-03-20' → 'miércoles, 20 de marzo de 2024'
 */
export function formatearFecha(fecha) {
  const d = typeof fecha === 'string' ? new Date(fecha + 'T00:00:00') : fecha
  return d.toLocaleDateString('es-CO', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

/**
 * Formatea una hora 'HH:MM:SS' a 'HH:MM'.
 */
export function formatearHora(hora) {
  return hora ? hora.slice(0, 5) : ''
}

/**
 * Retorna la fecha de hoy en formato 'YYYY-MM-DD'.
 */
export function hoy() {
  return new Date().toISOString().split('T')[0]
}

/**
 * Verifica si una fecha es anterior a hoy (ya pasó).
 */
export function esFechaPasada(fecha) {
  return fecha < hoy()
}

/**
 * Genera slots de reserva de `duracionMin` minutos dentro de un rango horario.
 * Maneja correctamente rangos que cruzan la medianoche.
 * @param {string} horaInicioStr  - 'HH:MM' o 'HH:MM:SS'
 * @param {string} horaFinStr     - 'HH:MM' o 'HH:MM:SS'
 * @param {number} duracionMin    - duración de cada turno en minutos (default 60)
 * @returns {{ value: string, label: string }[]}
 */
export function generarSlots(horaInicioStr, horaFinStr, duracionMin = 60) {
  const toMin = str => {
    const [h, m] = str.split(':').map(Number)
    return h * 60 + m
  }
  const toStr = min => {
    const total = min % (24 * 60)
    const h = Math.floor(total / 60)
    const m = total % 60
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
  }

  let inicio = toMin(horaInicioStr)
  let fin    = toMin(horaFinStr)
  if (fin <= inicio) fin += 24 * 60  // cruza medianoche

  const slots = []
  for (let cur = inicio; cur + duracionMin <= fin; cur += duracionMin) {
    slots.push({
      value: toStr(cur) + ':00',
      label: `${toStr(cur)} – ${toStr(cur + duracionMin)}`,
    })
  }
  return slots
}
