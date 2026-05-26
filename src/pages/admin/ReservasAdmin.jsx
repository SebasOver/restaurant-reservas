import { useState, useEffect, useCallback } from 'react'
import { getReservas, cancelarReserva, completarReserva, eliminarReserva } from '../../services/reservasService'
import { formatearFecha, formatearHora, hoy } from '../../utils/fechas'
import ConfirmModal from '../../components/ConfirmModal'

const ESTADOS = ['todos', 'activa', 'completada', 'cancelada']

export default function ReservasAdmin() {
  const [reservas, setReservas]   = useState([])
  const [loading, setLoading]     = useState(true)
  const [fecha, setFecha]         = useState(hoy())
  const [filtroEstado, setFiltro] = useState('todos')
  const [busy, setBusy]           = useState(null)
  const [confirmId, setConfirmId] = useState(null)

  const cargar = useCallback(async () => {
    setLoading(true)
    try {
      const data = await getReservas(fecha || null)
      setReservas(data)
    } finally {
      setLoading(false)
    }
  }, [fecha])

  useEffect(() => { cargar() }, [cargar])

  const lista = filtroEstado === 'todos'
    ? reservas
    : reservas.filter(r => r.estado === filtroEstado)

  const stats = {
    activas:    reservas.filter(r => r.estado === 'activa').length,
    completadas:reservas.filter(r => r.estado === 'completada').length,
    canceladas: reservas.filter(r => r.estado === 'cancelada').length,
  }

  async function accion(fn, id) {
    setBusy(id)
    try { await fn(id); await cargar() }
    catch (e) { alert(e.message) }
    finally { setBusy(null) }
  }

  async function confirmarBorrar() {
    await accion(eliminarReserva, confirmId)
    setConfirmId(null)
  }

  return (
    <div className="adm-section">
      {confirmId && (
        <ConfirmModal
          mensaje="Esta acción eliminará la reserva permanentemente y no se puede deshacer."
          onConfirmar={confirmarBorrar}
          onCancelar={() => setConfirmId(null)}
        />
      )}
      <div className="adm-section__head">
        <div>
          <h1 className="adm-section__title">Reservas</h1>
          <p className="adm-section__sub">
            {fecha ? formatearFecha(fecha) : 'Todas las fechas'}
          </p>
        </div>
        <button className="adm-btn adm-btn--ghost adm-btn--sm" onClick={cargar}>
          ↻ Actualizar
        </button>
      </div>

      {/* Cards de resumen */}
      <div className="adm-stats">
        <div className="adm-stat adm-stat--red">
          <span className="adm-stat__n">{stats.activas}</span>
          <span className="adm-stat__label">Activas</span>
        </div>
        <div className="adm-stat adm-stat--amber">
          <span className="adm-stat__n">{stats.completadas}</span>
          <span className="adm-stat__label">Completadas</span>
        </div>
        <div className="adm-stat adm-stat--muted">
          <span className="adm-stat__n">{stats.canceladas}</span>
          <span className="adm-stat__label">Canceladas</span>
        </div>
        <div className="adm-stat adm-stat--green">
          <span className="adm-stat__n">{reservas.length}</span>
          <span className="adm-stat__label">Total</span>
        </div>
      </div>

      {/* Filtros */}
      <div className="adm-filters">
        <input
          className="adm-input"
          type="date"
          value={fecha}
          onChange={e => setFecha(e.target.value)}
          title="Filtrar por fecha (vacío = todas)"
        />
        <select
          className="adm-input"
          value={filtroEstado}
          onChange={e => setFiltro(e.target.value)}
        >
          {ESTADOS.map(e => (
            <option key={e} value={e}>
              {e === 'todos' ? 'Todos los estados' : e.charAt(0).toUpperCase() + e.slice(1)}
            </option>
          ))}
        </select>
        {fecha && (
          <button className="adm-btn adm-btn--ghost adm-btn--sm" onClick={() => setFecha('')}>
            Ver todas las fechas
          </button>
        )}
      </div>

      {/* Tabla */}
      {loading ? (
        <div className="adm-loading">Cargando reservas…</div>
      ) : lista.length === 0 ? (
        <div className="adm-empty">No hay reservas con los filtros seleccionados.</div>
      ) : (
        <div className="adm-table-wrap">
          <table className="adm-table">
            <thead>
              <tr>
                <th>Cliente</th>
                <th>Contacto</th>
                <th>Mesa</th>
                <th>Fecha</th>
                <th>Hora</th>
                <th>Pers.</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {lista.map(r => (
                <tr key={r.id}>
                  <td style={{ fontWeight: 500 }}>{r.cliente_nombre}</td>
                  <td style={{ fontSize: '0.78rem', color: 'var(--a-muted)' }}>
                    {r.cliente_tel && <div>{r.cliente_tel}</div>}
                    {r.cliente_email && <div>{r.cliente_email}</div>}
                  </td>
                  <td>
                    {r.mesas
                      ? `#${r.mesas.numero} · ${r.mesas.ubicacion || ''}`
                      : '—'}
                  </td>
                  <td style={{ fontSize: '0.8rem' }}>{formatearFecha(r.fecha)}</td>
                  <td>{formatearHora(r.hora)}</td>
                  <td style={{ textAlign: 'center' }}>{r.num_personas}</td>
                  <td><span className={`badge badge--${r.estado}`}>{r.estado}</span></td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                      {r.estado === 'activa' && (
                        <>
                          <button
                            className="adm-btn adm-btn--sm"
                            disabled={busy === r.id}
                            onClick={() => accion(completarReserva, r.id)}
                            style={{ background: 'rgba(74,222,128,0.15)', color: 'var(--a-green)', border: '1px solid rgba(74,222,128,0.3)' }}
                          >
                            Completar
                          </button>
                          <button
                            className="adm-btn adm-btn--sm adm-btn--danger"
                            disabled={busy === r.id}
                            onClick={() => accion(cancelarReserva, r.id)}
                          >
                            Cancelar
                          </button>
                        </>
                      )}
                      <button
                        className="adm-btn adm-btn--sm adm-btn--ghost"
                        disabled={busy === r.id}
                        onClick={() => setConfirmId(r.id)}
                        style={{ fontSize: '0.65rem' }}
                      >
                        ✕
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
