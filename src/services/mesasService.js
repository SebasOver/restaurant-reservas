import { supabase } from '../lib/supabase'

/**
 * Obtiene todas las mesas del restaurante.
 * @param {string} [estado] - Filtra por estado: 'disponible' | 'ocupada' | 'bloqueada'
 */
export async function getMesas(estado = null) {
  let query = supabase.from('mesas').select('*').order('numero')
  if (estado) query = query.eq('estado', estado)
  const { data, error } = await query
  if (error) throw error
  return data
}

/**
 * Obtiene una mesa por su ID.
 */
export async function getMesaById(id) {
  const { data, error } = await supabase
    .from('mesas')
    .select('*')
    .eq('id', id)
    .single()
  if (error) throw error
  return data
}

/**
 * Actualiza el estado de una mesa.
 * @param {string} id
 * @param {'disponible'|'ocupada'|'bloqueada'} estado
 */
export async function updateEstadoMesa(id, estado) {
  const { data, error } = await supabase
    .from('mesas')
    .update({ estado })
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}
