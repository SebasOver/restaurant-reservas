import { useState, useEffect } from 'react'
import { getMesas } from '../services/mesasService'
import { getHorarios } from '../services/horariosService'
import { getReservas, crearReserva } from '../services/reservasService'
import { validarReserva } from '../utils/validaciones'
import { getDiaSemana, hoy } from '../utils/fechas'
import './ReservaForm.css'

const ESTADO_INICIAL = {
  cliente_nombre: '',
  cliente_tel:    '',
  cliente_email:  '',
  fecha:          '',
  hora:           '',
  num_personas:   1,
  mesa_id:        '',
}

function getEstadoVisual(mesa, mesasReservadasIds, numPersonas) {
  if (mesa.estado === 'bloqueada') return 'bloqueada'
  if (mesa.estado === 'ocupada')   return 'ocupada'
  if (mesasReservadasIds.has(mesa.id)) return 'reservada'
  if (mesa.capacidad < Number(numPersonas)) return 'chica'
  return 'disponible'
}

export default function ReservaForm() {
  const [form, setForm]         = useState(ESTADO_INICIAL)
  const [errores, setErrores]   = useState({})
  const [todasMesas, setTodasMesas] = useState([])
  const [horarios, setHorarios] = useState([])
  const [mesasReservadasIds, setMesasReservadasIds] = useState(new Set())
  const [loadingSlot, setLoadingSlot] = useState(false)
  const [estado, setEstado]     = useState('idle')
  const [mensajeError, setMensajeError] = useState('')

  useEffect(() => {
    getMesas().then(setTodasMesas).catch(() => {})
    getHorarios().then(setHorarios).catch(() => {})
  }, [])

  // Cuando cambia fecha+hora, recalcula qué mesas están reservadas en ese slot
  useEffect(() => {
    if (!form.fecha || !form.hora) {
      setMesasReservadasIds(new Set())
      return
    }
    setLoadingSlot(true)
    getReservas(form.fecha)
      .then(reservas => {
        const ocupadas = reservas
          .filter(r => r.hora === form.hora && r.estado === 'activa')
          .map(r => r.mesa_id)
        setMesasReservadasIds(new Set(ocupadas))
      })
      .catch(() => {})
      .finally(() => setLoadingSlot(false))
  }, [form.fecha, form.hora])

  const horariosFiltrados = form.fecha
    ? horarios.filter(h => h.dia_semana === getDiaSemana(form.fecha))
    : []

  const mesasDisponibles = todasMesas.filter(m =>
    getEstadoVisual(m, mesasReservadasIds, form.num_personas) === 'disponible'
  )

  // Agrupa mesas por ubicación para el salón
  const mesasPorUbicacion = todasMesas.reduce((acc, m) => {
    const ubi = m.ubicacion || 'General'
    if (!acc[ubi]) acc[ubi] = []
    acc[ubi].push(m)
    return acc
  }, {})

  const mostrarSalon = form.fecha && form.hora

  function handleChange(e) {
    const { name, value } = e.target
    if (name === 'fecha') {
      setForm(prev => ({ ...prev, fecha: value, hora: '', mesa_id: '' }))
    } else if (name === 'num_personas') {
      setForm(prev => ({ ...prev, num_personas: value, mesa_id: '' }))
    } else {
      setForm(prev => ({ ...prev, [name]: value }))
    }
    if (errores[name]) setErrores(prev => ({ ...prev, [name]: '' }))
  }

  function seleccionarMesa(mesa) {
    const ev = getEstadoVisual(mesa, mesasReservadasIds, form.num_personas)
    if (ev !== 'disponible') return
    setForm(prev => ({ ...prev, mesa_id: mesa.id }))
    if (errores.mesa_id) setErrores(prev => ({ ...prev, mesa_id: '' }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const { valido, errores: errs } = validarReserva(form)
    if (!valido) { setErrores(errs); return }

    setEstado('loading')
    try {
      await crearReserva({
        mesa_id:        form.mesa_id,
        cliente_nombre: form.cliente_nombre.trim(),
        cliente_tel:    form.cliente_tel.trim(),
        cliente_email:  form.cliente_email.trim(),
        fecha:          form.fecha,
        hora:           form.hora,
        num_personas:   Number(form.num_personas),
        estado:         'activa',
      })
      setEstado('success')
      setForm(ESTADO_INICIAL)
      setErrores({})
    } catch (err) {
      setEstado('error')
      setMensajeError(err.message || 'Ocurrió un error. Intenta de nuevo.')
    }
  }

  if (estado === 'success') {
    return (
      <div className="rf rf--success">
        <div className="rf__success-icon">✓</div>
        <h3>¡Reserva confirmada!</h3>
        <p>Te esperamos en The Gordo. Recibirás confirmación por correo.</p>
        <button className="rf__btn" onClick={() => setEstado('idle')}>
          Hacer otra reserva
        </button>
      </div>
    )
  }

  return (
    <form className="rf" onSubmit={handleSubmit} noValidate>

      {/* Nombre */}
      <div className="rf__field">
        <label className="rf__label">Nombre completo *</label>
        <input
          className={`rf__input ${errores.cliente_nombre ? 'rf__input--error' : ''}`}
          type="text"
          name="cliente_nombre"
          value={form.cliente_nombre}
          onChange={handleChange}
          placeholder="Juan Pérez"
        />
        {errores.cliente_nombre && <span className="rf__error">{errores.cliente_nombre}</span>}
      </div>

      {/* Tel + Email */}
      <div className="rf__row">
        <div className="rf__field">
          <label className="rf__label">Teléfono</label>
          <input
            className={`rf__input ${errores.contacto ? 'rf__input--error' : ''}`}
            type="tel"
            name="cliente_tel"
            value={form.cliente_tel}
            onChange={handleChange}
            placeholder="300 123 4567"
          />
        </div>
        <div className="rf__field">
          <label className="rf__label">Correo electrónico</label>
          <input
            className={`rf__input ${errores.cliente_email || errores.contacto ? 'rf__input--error' : ''}`}
            type="email"
            name="cliente_email"
            value={form.cliente_email}
            onChange={handleChange}
            placeholder="juan@correo.com"
          />
        </div>
      </div>
      {errores.contacto    && <span className="rf__error">{errores.contacto}</span>}
      {errores.cliente_email && <span className="rf__error">{errores.cliente_email}</span>}

      {/* Personas */}
      <div className="rf__field">
        <label className="rf__label">Número de personas *</label>
        <div className="rf__counter">
          <button type="button" className="rf__counter-btn"
            onClick={() => handleChange({ target: { name: 'num_personas', value: Math.max(1, Number(form.num_personas) - 1) } })}>
            −
          </button>
          <span className="rf__counter-val">{form.num_personas}</span>
          <button type="button" className="rf__counter-btn"
            onClick={() => handleChange({ target: { name: 'num_personas', value: Number(form.num_personas) + 1 } })}>
            +
          </button>
        </div>
        {errores.num_personas && <span className="rf__error">{errores.num_personas}</span>}
      </div>

      {/* Fecha + Hora */}
      <div className="rf__row">
        <div className="rf__field">
          <label className="rf__label">Fecha *</label>
          <input
            className={`rf__input ${errores.fecha ? 'rf__input--error' : ''}`}
            type="date"
            name="fecha"
            value={form.fecha}
            min={hoy()}
            onChange={handleChange}
          />
          {errores.fecha && <span className="rf__error">{errores.fecha}</span>}
        </div>
        <div className="rf__field">
          <label className="rf__label">Hora *</label>
          <select
            className={`rf__input ${errores.hora ? 'rf__input--error' : ''}`}
            name="hora"
            value={form.hora}
            onChange={handleChange}
            disabled={!form.fecha}
          >
            <option value="">
              {!form.fecha ? 'Elige fecha primero' : horariosFiltrados.length === 0 ? 'Sin turnos disponibles' : 'Seleccionar hora'}
            </option>
            {horariosFiltrados.map(h => (
              <option key={h.id} value={h.hora_inicio}>
                {h.hora_inicio.slice(0,5)} – {h.hora_fin.slice(0,5)}
              </option>
            ))}
          </select>
          {errores.hora && <span className="rf__error">{errores.hora}</span>}
        </div>
      </div>

      {/* ── VISTA DEL SALÓN ── */}
      <div className="salon">
        <div className="salon__header">
          <span className="salon__title">Vista del salón</span>
          {loadingSlot && <span className="salon__loading">Verificando disponibilidad…</span>}
          {mostrarSalon && !loadingSlot && (
            <span className="salon__info">
              {mesasDisponibles.length} mesa{mesasDisponibles.length !== 1 ? 's' : ''} disponible{mesasDisponibles.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>

        {!mostrarSalon ? (
          <p className="salon__hint">Selecciona fecha y hora para ver la disponibilidad en tiempo real</p>
        ) : (
          <div className="salon__plano">
            {Object.entries(mesasPorUbicacion).map(([ubicacion, mesas]) => (
              <div className="salon__zona" key={ubicacion}>
                <span className="salon__zona-label">{ubicacion}</span>
                <div className="salon__mesas">
                  {mesas.map(mesa => {
                    const ev = getEstadoVisual(mesa, mesasReservadasIds, form.num_personas)
                    const seleccionada = form.mesa_id === mesa.id
                    return (
                      <button
                        type="button"
                        key={mesa.id}
                        className={`salon__mesa salon__mesa--${ev} ${seleccionada ? 'salon__mesa--sel' : ''}`}
                        onClick={() => seleccionarMesa(mesa)}
                        title={
                          ev === 'reservada' ? 'Reservada en este horario'
                          : ev === 'ocupada'  ? 'Ocupada'
                          : ev === 'bloqueada'? 'Bloqueada'
                          : ev === 'chica'    ? `Capacidad insuficiente (${mesa.capacidad} pers.)`
                          : `Mesa #${mesa.numero} · ${mesa.capacidad} personas`
                        }
                      >
                        <span className="salon__mesa-num">#{mesa.numero}</span>
                        <span className="salon__mesa-cap">{mesa.capacidad}p</span>
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}

            <div className="salon__entrada">ENTRADA</div>

            <div className="salon__leyenda">
              <span className="salon__ley-item salon__ley--disponible">Disponible</span>
              <span className="salon__ley-item salon__ley--reservada">Reservada</span>
              <span className="salon__ley-item salon__ley--ocupada">Ocupada</span>
              <span className="salon__ley-item salon__ley--bloqueada">Bloqueada</span>
              <span className="salon__ley-item salon__ley--chica">Sin capacidad</span>
            </div>
          </div>
        )}
      </div>

      {errores.mesa_id && <span className="rf__error">{errores.mesa_id}</span>}

      {/* Error global */}
      {estado === 'error' && (
        <div className="rf__alert">{mensajeError}</div>
      )}

      <button
        type="submit"
        className="rf__btn"
        disabled={estado === 'loading'}
      >
        {estado === 'loading' ? 'Enviando…' : 'Confirmar reserva'}
      </button>

    </form>
  )
}
