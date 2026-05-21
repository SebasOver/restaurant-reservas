import { useState, useEffect } from 'react'
import { getTodosHorarios, crearHorario, actualizarHorario, eliminarHorario } from '../../services/horariosService'
import { generarSlots } from '../../utils/fechas'

const DIAS = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo']
const DIAS_LABEL = {
  lunes: 'Lunes', martes: 'Martes', miercoles: 'Miércoles',
  jueves: 'Jueves', viernes: 'Viernes', sabado: 'Sábado', domingo: 'Domingo',
}
const FORM_INI = { dia_semana: 'lunes', hora_inicio: '16:00', hora_fin: '23:00', activo: true }

export default function HorariosAdmin() {
  const [horarios, setHorarios] = useState([])
  const [loading, setLoading]   = useState(true)
  const [modal, setModal]       = useState(false)
  const [form, setForm]         = useState(FORM_INI)
  const [formErr, setFormErr]   = useState('')
  const [busy, setBusy]         = useState(false)

  async function cargar() {
    setLoading(true)
    try { setHorarios(await getTodosHorarios()) }
    finally { setLoading(false) }
  }

  useEffect(() => { cargar() }, [])

  async function guardar() {
    if (!form.hora_inicio || !form.hora_fin) {
      setFormErr('Hora de inicio y fin son obligatorias.')
      return
    }
    setBusy(true)
    setFormErr('')
    try {
      await crearHorario({
        dia_semana:  form.dia_semana,
        hora_inicio: form.hora_inicio + ':00',
        hora_fin:    form.hora_fin + ':00',
        activo:      form.activo,
      })
      setModal(false)
      await cargar()
    } catch (e) {
      setFormErr(e.message)
    } finally {
      setBusy(false)
    }
  }

  async function toggleActivo(h) {
    try { await actualizarHorario(h.id, { activo: !h.activo }); await cargar() }
    catch (e) { alert(e.message) }
  }

  async function borrar(id) {
    if (!confirm('¿Eliminar este horario?')) return
    try { await eliminarHorario(id); await cargar() }
    catch (e) { alert(e.message) }
  }

  // Agrupa horarios por día
  const porDia = DIAS.reduce((acc, d) => {
    acc[d] = horarios.filter(h => h.dia_semana === d)
    return acc
  }, {})

  return (
    <div className="adm-section">
      <div className="adm-section__head">
        <div>
          <h1 className="adm-section__title">Horarios</h1>
          <p className="adm-section__sub">Rangos de atención por día · los turnos de 1 hora se generan automáticamente</p>
        </div>
        <button className="adm-btn" onClick={() => { setForm(FORM_INI); setFormErr(''); setModal(true) }}>
          + Nuevo rango
        </button>
      </div>

      {loading ? (
        <div className="adm-loading">Cargando horarios…</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {DIAS.map(dia => {
            const rangos = porDia[dia]
            return (
              <div
                key={dia}
                style={{
                  border: '1px solid var(--a-border)',
                  borderRadius: '0.4rem',
                  overflow: 'hidden',
                }}
              >
                {/* Cabecera del día */}
                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '0.75rem 1rem', background: 'var(--a-dark)',
                  borderBottom: rangos.length ? '1px solid var(--a-border)' : 'none',
                }}>
                  <span style={{
                    fontFamily: 'Bebas Neue, impact, sans-serif',
                    fontSize: '1.1rem', letterSpacing: '0.08em', color: '#fff',
                  }}>
                    {DIAS_LABEL[dia]}
                  </span>
                  {rangos.length === 0 && (
                    <span style={{ fontSize: '0.72rem', color: 'var(--a-muted)' }}>Sin horarios</span>
                  )}
                </div>

                {/* Rangos del día */}
                {rangos.map(h => {
                  const slots = generarSlots(h.hora_inicio, h.hora_fin)
                  return (
                    <div
                      key={h.id}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '1rem',
                        padding: '0.7rem 1rem',
                        borderBottom: '1px solid var(--a-border)',
                        flexWrap: 'wrap',
                        opacity: h.activo ? 1 : 0.5,
                      }}
                    >
                      {/* Rango */}
                      <span style={{
                        fontFamily: 'Bebas Neue, impact, sans-serif',
                        fontSize: '1.25rem', color: h.activo ? '#fff' : 'var(--a-muted)',
                        letterSpacing: '0.04em', minWidth: '140px',
                      }}>
                        {h.hora_inicio.slice(0,5)} — {h.hora_fin.slice(0,5)}
                      </span>

                      {/* Slots generados */}
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', flex: 1 }}>
                        {slots.map(s => (
                          <span key={s.value} style={{
                            fontSize: '0.65rem', fontWeight: 600,
                            padding: '0.2rem 0.5rem',
                            border: '1px solid var(--a-border)',
                            borderRadius: '20px',
                            color: h.activo ? 'var(--a-amber)' : 'var(--a-muted)',
                            background: h.activo ? 'rgba(232,160,32,0.06)' : 'transparent',
                          }}>
                            {s.label}
                          </span>
                        ))}
                        {slots.length === 0 && (
                          <span style={{ fontSize: '0.72rem', color: 'var(--a-muted)' }}>
                            Rango menor a 1 hora
                          </span>
                        )}
                      </div>

                      {/* Toggle activo */}
                      <label className="adm-toggle" title={h.activo ? 'Desactivar' : 'Activar'}>
                        <input
                          type="checkbox"
                          checked={h.activo}
                          onChange={() => toggleActivo(h)}
                        />
                        <span className="adm-toggle__slider" />
                      </label>

                      {/* Eliminar */}
                      <button
                        className="adm-btn adm-btn--danger adm-btn--sm"
                        onClick={() => borrar(h.id)}
                      >
                        ✕
                      </button>
                    </div>
                  )
                })}
              </div>
            )
          })}
        </div>
      )}

      {/* Modal nuevo rango */}
      {modal && (
        <div className="adm-overlay" onClick={e => { if (e.target === e.currentTarget) setModal(false) }}>
          <div className="adm-modal">
            <h2 className="adm-modal__title">Nuevo rango horario</h2>

            <div className="adm-modal__field">
              <label className="adm-modal__label">Día de la semana</label>
              <select
                className="adm-modal__input"
                value={form.dia_semana}
                onChange={e => setForm(p => ({ ...p, dia_semana: e.target.value }))}
              >
                {DIAS.map(d => <option key={d} value={d}>{DIAS_LABEL[d]}</option>)}
              </select>
            </div>

            <div className="adm-modal__row">
              <div className="adm-modal__field">
                <label className="adm-modal__label">Hora inicio</label>
                <input
                  className="adm-modal__input"
                  type="time"
                  value={form.hora_inicio}
                  onChange={e => setForm(p => ({ ...p, hora_inicio: e.target.value }))}
                />
              </div>
              <div className="adm-modal__field">
                <label className="adm-modal__label">Hora fin</label>
                <input
                  className="adm-modal__input"
                  type="time"
                  value={form.hora_fin}
                  onChange={e => setForm(p => ({ ...p, hora_fin: e.target.value }))}
                />
              </div>
            </div>

            {/* Preview de slots */}
            {form.hora_inicio && form.hora_fin && (
              <div style={{
                background: 'var(--a-black)', border: '1px solid var(--a-border)',
                borderRadius: '0.35rem', padding: '0.75rem',
              }}>
                <p style={{ fontSize: '0.65rem', color: 'var(--a-muted)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  Turnos generados
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                  {generarSlots(form.hora_inicio, form.hora_fin).map(s => (
                    <span key={s.value} style={{
                      fontSize: '0.7rem', fontWeight: 600,
                      padding: '0.2rem 0.6rem',
                      border: '1px solid rgba(232,160,32,0.3)',
                      borderRadius: '20px', color: 'var(--a-amber)',
                      background: 'rgba(232,160,32,0.06)',
                    }}>
                      {s.label}
                    </span>
                  ))}
                  {generarSlots(form.hora_inicio, form.hora_fin).length === 0 && (
                    <span style={{ fontSize: '0.72rem', color: 'var(--a-muted)' }}>
                      El rango debe ser de al menos 1 hora
                    </span>
                  )}
                </div>
              </div>
            )}

            <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
              <label className="adm-toggle">
                <input
                  type="checkbox"
                  checked={form.activo}
                  onChange={e => setForm(p => ({ ...p, activo: e.target.checked }))}
                />
                <span className="adm-toggle__slider" />
              </label>
              <span style={{ fontSize: '0.8rem', color: 'var(--a-text)' }}>
                Activo desde el inicio
              </span>
            </label>

            {formErr && <div className="adm-modal__error">{formErr}</div>}

            <div className="adm-modal__actions">
              <button className="adm-btn adm-btn--ghost" onClick={() => setModal(false)}>
                Cancelar
              </button>
              <button className="adm-btn" onClick={guardar} disabled={busy}>
                {busy ? 'Guardando…' : 'Crear rango'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
