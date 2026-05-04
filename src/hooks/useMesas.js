import { useState, useEffect } from 'react'
import { getMesas } from '../services/mesasService'

/**
 * Hook para obtener y gestionar el listado de mesas.
 * @param {string} [estadoFiltro] - Filtra por estado
 */
export function useMesas(estadoFiltro = null) {
  const [mesas, setMesas]     = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)

  useEffect(() => {
    async function fetchMesas() {
      try {
        setLoading(true)
        setError(null)
        const data = await getMesas(estadoFiltro)
        setMesas(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchMesas()
  }, [estadoFiltro])

  return { mesas, loading, error }
}
