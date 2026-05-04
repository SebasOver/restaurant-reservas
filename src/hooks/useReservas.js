import { useState, useEffect } from 'react'
import { getReservas, crearReserva, cancelarReserva } from '../services/reservasService'

/**
 * Hook para gestionar reservas.
 * @param {string} [fechaFiltro] - Filtra por fecha 'YYYY-MM-DD'
 */
export function useReservas(fechaFiltro = null) {
  const [reservas, setReservas] = useState([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState(null)

  useEffect(() => {
    fetchReservas()
  }, [fechaFiltro])

  async function fetchReservas() {
    try {
      setLoading(true)
      setError(null)
      const data = await getReservas(fechaFiltro)
      setReservas(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function crear(reserva) {
    const nueva = await crearReserva(reserva)
    setReservas(prev => [...prev, nueva])
    return nueva
  }

  async function cancelar(id) {
    const actualizada = await cancelarReserva(id)
    setReservas(prev => prev.map(r => r.id === id ? actualizada : r))
    return actualizada
  }

  return { reservas, loading, error, crear, cancelar, refetch: fetchReservas }
}
