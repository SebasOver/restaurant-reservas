import { useState, useEffect } from 'react'
import { getMesas } from '../services/mesasService'
import { getHorarios } from '../services/horariosService'
import { crearReserva } from '../services/reservasService'
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

export default function ReservaForm() {
  const [form, setForm]         = useState(ESTADO_INICIAL)
  const [errores, setErrores]   = useState({})
  const [mesas, setMesas]       = useState([])
  const [horarios, setHorarios] = useState([])
  const [estado, setEstado]     = useState('idle') // idle | loading | success | error
  const [mensajeError, setMensajeError] = useState('')

  useEffect(() => {
    getMesas('disponible').then(setMesas).catch(() => {})
    getHorarios().then(setHorarios).catch(() => {})
  }, [])

  // Filtra horarios según el día de la semana elegido
  const horariosFiltrados = form.fecha
    ? horarios.filter(h => h.dia_semana === getDiaSemana(form.fecha))
    : []

  // Filtra mesas con capacidad >= num_personas
  const mesasDisponibles = mesas.filter(m => m.capacidad >= Number(form.num_personas))

  function handleChange(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    if (errores[name]) setErrores(prev => ({ ...prev, [name]: '' }))
    // Si cambia fecha, resetea hora
    if (name === 'fecha') setForm(prev => ({ ...prev, fecha: value, hora: '' }))
    // Si cambia personas, resetea mesa
    if (name === 'num_personas') setForm(prev => ({ ...prev, num_personas: value, mesa_id: '' }))
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
      {errores.contacto  && <span className="rf__error">{errores.contacto}</span>}
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
              {!form.fecha ? 'Elige fecha primero' : horariosFiltrados.length === 0 ? 'No hay turnos' : 'Seleccionar hora'}
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

      {/* Mesa */}
      <div className="rf__field">
        <label className="rf__label">Mesa *</label>
        {mesasDisponibles.length === 0 ? (
          <p className="rf__hint">No hay mesas disponibles para {form.num_personas} persona(s).</p>
        ) : (
          <div className="rf__mesas">
            {mesasDisponibles.map(m => (
              <button
                type="button"
                key={m.id}
                className={`rf__mesa ${form.mesa_id === m.id ? 'rf__mesa--selected' : ''}`}
                onClick={() => setForm(prev => ({ ...prev, mesa_id: m.id }))}
              >
                <span className="rf__mesa-n">#{m.numero}</span>
                <span className="rf__mesa-cap">{m.capacidad} pers.</span>
                {m.ubicacion && <span className="rf__mesa-ubi">{m.ubicacion}</span>}
              </button>
            ))}
          </div>
        )}
        {errores.mesa_id && <span className="rf__error">{errores.mesa_id}</span>}
      </div>

      {/* Error global */}
      {estado === 'error' && (
        <div className="rf__alert">
          {mensajeError}
        </div>
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
