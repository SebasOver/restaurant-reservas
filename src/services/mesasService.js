import { supabase } from '../lib/supabase'

export async function getMesas(estado = null) {
  let query = supabase.from('mesas').select('*').order('numero')
  if (estado) query = query.eq('estado', estado)
  const { data, error } = await query
  if (error) throw error
  return data
}

export async function getMesaById(id) {
  const { data, error } = await supabase
    .from('mesas').select('*').eq('id', id).single()
  if (error) throw error
  return data
}

export async function crearMesa(mesa) {
  const { data, error } = await supabase
    .from('mesas').insert([mesa]).select().single()
  if (error) throw error
  return data
}

export async function actualizarMesa(id, cambios) {
  const { data, error } = await supabase
    .from('mesas').update(cambios).eq('id', id).select().single()
  if (error) throw error
  return data
}

export async function eliminarMesa(id) {
  const { error } = await supabase.from('mesas').delete().eq('id', id)
  if (error) throw error
}

export async function updateEstadoMesa(id, estado) {
  return actualizarMesa(id, { estado })
}
