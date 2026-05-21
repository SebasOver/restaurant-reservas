import { supabase } from '../lib/supabase'

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

export async function crearReserva(reserva) {
  const { data, error } = await supabase
    .from('reservas').insert([reserva]).select().single()
  if (error) throw error
  return data
}

export async function cancelarReserva(id) {
  const { data, error } = await supabase
    .from('reservas').update({ estado: 'cancelada' }).eq('id', id).select().single()
  if (error) throw error
  return data
}

export async function completarReserva(id) {
  const { data, error } = await supabase
    .from('reservas').update({ estado: 'completada' }).eq('id', id).select().single()
  if (error) throw error
  return data
}

export async function eliminarReserva(id) {
  const { error } = await supabase.from('reservas').delete().eq('id', id)
  if (error) throw error
}

export async function getReservasPorMesaYFecha(mesaId, fecha) {
  const { data, error } = await supabase
    .from('reservas').select('*')
    .eq('mesa_id', mesaId).eq('fecha', fecha).eq('estado', 'activa')
  if (error) throw error
  return data
}
