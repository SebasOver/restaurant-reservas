import { supabase } from '../lib/supabase'

/**
 * Obtiene todos los horarios activos.
 */
export async function getHorarios() {
  const { data, error } = await supabase
    .from('horarios')
    .select('*')
    .eq('activo', true)
    .order('dia_semana')
  if (error) throw error
  return data
}

/**
 * Obtiene los horarios de un día específico.
 * @param {string} diaSemana - 'lunes' | 'martes' | ... | 'domingo'
 */
export async function getHorariosPorDia(diaSemana) {
  const { data, error } = await supabase
    .from('horarios')
    .select('*')
    .eq('dia_semana', diaSemana)
    .eq('activo', true)
  if (error) throw error
  return data
}
