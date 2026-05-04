import { supabase } from '../lib/supabase'

/**
 * Obtiene todas las reservas, con datos de la mesa incluidos.
 * @param {string} [fecha] - Filtra por fecha 'YYYY-MM-DD'
 */
export async function getReservas(fecha = null) {
  let query = supabase
    .from('reservas')
    .select('*, mesas(numero, capacidad, ubicacion)')
    .order('fecha')
    .order('hora')
  if (fecha) query = query.eq('fecha', fecha)
  const { data, error } = await query
  if (error) throw error
  return data
}

/**
 * Crea una nueva reserva.
 * @param {Object} reserva
 */
export async function crearReserva(reserva) {
  const { data, error } = await supabase
    .from('reservas')
    .insert([reserva])
    .select()
    .single()
  if (error) throw error
  return data
}

/**
 * Cancela una reserva por su ID.
 */
export async function cancelarReserva(id) {
  const { data, error } = await supabase
    .from('reservas')
    .update({ estado: 'cancelada' })
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

/**
 * Obtiene reservas activas para una mesa y fecha específica.
 * Útil para verificar disponibilidad.
 */
export async function getReservasPorMesaYFecha(mesaId, fecha) {
  const { data, error } = await supabase
    .from('reservas')
    .select('*')
    .eq('mesa_id', mesaId)
    .eq('fecha', fecha)
    .eq('estado', 'activa')
  if (error) throw error
  return data
}
