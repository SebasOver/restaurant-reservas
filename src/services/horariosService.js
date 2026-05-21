import { supabase } from '../lib/supabase'

const ORDEN_DIAS = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo']

export async function getHorarios() {
  const { data, error } = await supabase
    .from('horarios').select('*').eq('activo', true).order('dia_semana')
  if (error) throw error
  return data
}

export async function getTodosHorarios() {
  const { data, error } = await supabase
    .from('horarios').select('*').order('dia_semana').order('hora_inicio')
  if (error) throw error
  // Ordena por día de la semana lógico (lunes→domingo)
  return (data || []).sort(
    (a, b) => ORDEN_DIAS.indexOf(a.dia_semana) - ORDEN_DIAS.indexOf(b.dia_semana)
  )
}

export async function getHorariosPorDia(diaSemana) {
  const { data, error } = await supabase
    .from('horarios').select('*').eq('dia_semana', diaSemana).eq('activo', true)
  if (error) throw error
  return data
}

export async function crearHorario(horario) {
  const { data, error } = await supabase
    .from('horarios').insert([horario]).select().single()
  if (error) throw error
  return data
}

export async function actualizarHorario(id, cambios) {
  const { data, error } = await supabase
    .from('horarios').update(cambios).eq('id', id).select().single()
  if (error) throw error
  return data
}

export async function eliminarHorario(id) {
  const { error } = await supabase.from('horarios').delete().eq('id', id)
  if (error) throw error
}
