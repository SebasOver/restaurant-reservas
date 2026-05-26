import { useState, useEffect } from 'react'
import { getMesas, crearMesa, actualizarMesa, eliminarMesa } from '../../services/mesasService'
import ConfirmModal from '../../components/ConfirmModal'

const ESTADOS  = ['disponible', 'ocupada', 'bloqueada']
const FORM_INI = { numero: '', capacidad: '', ubicacion: '', estado: 'disponible' }

export default function MesasAdmin() {
  const [mesas, setMesas]             = useState([])
  const [loading, setLoading]         = useState(true)
  const [modal, setModal]             = useState(false)      // 'crear' | 'editar' | false
  const [seleccion, setSel]           = useState(null)
  const [form, setForm]               = useState(FORM_INI)
  const [formErr, setFormErr]         = useState('')
  const [busy, setBusy]               = useState(false)
  const [confirmId, setConfirmId]     = useState(null)
  const [ubicacionNueva, setUbicNueva] = useState(false)

  async function cargar() {
    setLoading(true)
    try { setMesas(await getMesas()) }
    finally { setLoading(false) }
  }

  useEffect(() => { cargar() }, [])

  const opcionesUbicacion = [...new Set(mesas.filter(m => m.ubicacion).map(m => m.ubicacion))]

  function abrirCrear() {
    setForm(FORM_INI)
    setFormErr('')
    setSel(null)
    setUbicNueva(false)
    setModal('crear')
  }

  function abrirEditar(mesa) {
    const esCustom = !!mesa.ubicacion && !opcionesUbicacion.includes(mesa.ubicacion)
    setUbicNueva(esCustom)
    setForm({
      numero:    String(mesa.numero),
      capacidad: String(mesa.capacidad),
      ubicacion: mesa.ubicacion || '',
      estado:    mesa.estado,
    })
    setFormErr('')
    setSel(mesa)
    setModal('editar')
  }

  async function guardar() {
    if (!form.numero || !form.capacidad) {
      setFormErr('Número y capacidad son obligatorios.')
      return
    }
    setBusy(true)
    setFormErr('')
    try {
      const payload = {
        numero:    Number(form.numero),
        capacidad: Number(form.capacidad),
        ubicacion: form.ubicacion.trim() || null,
        estado:    form.estado,
      }
      if (modal === 'crear') await crearMesa(payload)
      else await actualizarMesa(seleccion.id, payload)
      setModal(false)
      await cargar()
    } catch (e) {
      setFormErr(e.message)
    } finally {
      setBusy(false)
    }
  }

  function borrar(id) {
    setConfirmId(id)
  }

  async function confirmarBorrar() {
    try { await eliminarMesa(confirmId); await cargar() }
    catch (e) { alert(e.message) }
    finally { setConfirmId(null) }
  }

  async function cambiarEstado(mesa, estado) {
    try { await actualizarMesa(mesa.id, { estado }); await cargar() }
    catch (e) { alert(e.message) }
  }

  const stats = {
    disponibles: mesas.filter(m => m.estado === 'disponible').length,
    ocupadas:    mesas.filter(m => m.estado === 'ocupada').length,
    bloqueadas:  mesas.filter(m => m.estado === 'bloqueada').length,
  }

  return (
    <div className="adm-section">
      <div className="adm-section__head">
        <div>
          <h1 className="adm-section__title">Mesas</h1>
          <p className="adm-section__sub">{mesas.length} mesas registradas</p>
        </div>
        <button className="adm-btn" onClick={abrirCrear}>+ Nueva mesa</button>
      </div>

      <div className="adm-stats">
        <div className="adm-stat adm-stat--green">
          <span className="adm-stat__n">{stats.disponibles}</span>
          <span className="adm-stat__label">Disponibles</span>
        </div>
        <div className="adm-stat adm-stat--red">
          <span className="adm-stat__n">{stats.ocupadas}</span>
          <span className="adm-stat__label">Ocupadas</span>
        </div>
        <div className="adm-stat adm-stat--muted">
          <span className="adm-stat__n">{stats.bloqueadas}</span>
          <span className="adm-stat__label">Bloqueadas</span>
        </div>
      </div>

      {loading ? (
        <div className="adm-loading">Cargando mesas…</div>
      ) : mesas.length === 0 ? (
        <div className="adm-empty">No hay mesas registradas. Crea la primera.</div>
      ) : (
        <div className="adm-table-wrap">
          <table className="adm-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Capacidad</th>
                <th>Ubicación</th>
                <th>Estado</th>
                <th>Cambiar estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {mesas.map(m => (
                <tr key={m.id}>
                  <td style={{ fontFamily: 'Bebas Neue, impact, sans-serif', fontSize: '1.1rem' }}>
                    #{m.numero}
                  </td>
                  <td>{m.capacidad} personas</td>
                  <td style={{ color: 'var(--a-muted)' }}>{m.ubicacion || '—'}</td>
                  <td><span className={`badge badge--${m.estado}`}>{m.estado}</span></td>
                  <td>
                    <select
                      className="adm-input"
                      value={m.estado}
                      style={{ padding: '0.3rem 0.6rem', fontSize: '0.78rem' }}
                      onChange={e => cambiarEstado(m, e.target.value)}
                    >
                      {ESTADOS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                      <button className="adm-btn adm-btn--ghost adm-btn--sm" onClick={() => abrirEditar(m)}>
                        Editar
                      </button>
                      <button className="adm-btn adm-btn--danger adm-btn--sm" onClick={() => borrar(m.id)}>
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

      {/* Modal confirmación eliminar */}
      {confirmId && (
        <ConfirmModal
          mensaje="Esta acción eliminará la mesa permanentemente. Se perderán los datos asociados y no se puede deshacer."
          onConfirmar={confirmarBorrar}
          onCancelar={() => setConfirmId(null)}
        />
      )}

      {/* Modal crear/editar */}
      {modal && (
        <div className="adm-overlay" onClick={e => { if (e.target === e.currentTarget) setModal(false) }}>
          <div className="adm-modal">
            <h2 className="adm-modal__title">
              {modal === 'crear' ? 'Nueva mesa' : `Editar mesa #${seleccion?.numero}`}
            </h2>

            <div className="adm-modal__row">
              <div className="adm-modal__field">
                <label className="adm-modal__label">Número *</label>
                <input
                  className="adm-modal__input"
                  type="text"
                  inputMode="numeric"
                  value={form.numero}
                  onChange={e => setForm(p => ({ ...p, numero: e.target.value.replace(/\D/g, '') }))}
                  placeholder="1"
                />
              </div>
              <div className="adm-modal__field">
                <label className="adm-modal__label">Capacidad *</label>
                <input
                  className="adm-modal__input"
                  type="text"
                  inputMode="numeric"
                  value={form.capacidad}
                  onChange={e => setForm(p => ({ ...p, capacidad: e.target.value.replace(/\D/g, '') }))}
                  placeholder="4"
                />
              </div>
            </div>

            <div className="adm-modal__field">
              <label className="adm-modal__label">Ubicación / Zona</label>
              <select
                className="adm-modal__input"
                value={ubicacionNueva ? '__nueva__' : (form.ubicacion || '')}
                onChange={e => {
                  if (e.target.value === '__nueva__') {
                    setUbicNueva(true)
                    setForm(p => ({ ...p, ubicacion: '' }))
                  } else {
                    setUbicNueva(false)
                    setForm(p => ({ ...p, ubicacion: e.target.value }))
                  }
                }}
              >
                <option value="">Sin especificar</option>
                {opcionesUbicacion.map(u => <option key={u} value={u}>{u}</option>)}
                <option value="__nueva__">+ Crear nueva ubicación…</option>
              </select>
              {ubicacionNueva && (
                <input
                  className="adm-modal__input"
                  type="text"
                  style={{ marginTop: '0.5rem' }}
                  placeholder="Ej: Terraza, Salón VIP…"
                  value={form.ubicacion}
                  onChange={e => setForm(p => ({ ...p, ubicacion: e.target.value }))}
                  autoFocus
                />
              )}
            </div>

            <div className="adm-modal__field">
              <label className="adm-modal__label">Estado inicial</label>
              <select
                className="adm-modal__input"
                value={form.estado}
                onChange={e => setForm(p => ({ ...p, estado: e.target.value }))}
              >
                {ESTADOS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            {formErr && <div className="adm-modal__error">{formErr}</div>}

            <div className="adm-modal__actions">
              <button className="adm-btn adm-btn--ghost" onClick={() => setModal(false)}>
                Cancelar
              </button>
              <button className="adm-btn" onClick={guardar} disabled={busy}>
                {busy ? 'Guardando…' : modal === 'crear' ? 'Crear mesa' : 'Guardar cambios'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
