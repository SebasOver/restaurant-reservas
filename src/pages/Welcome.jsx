import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import './Welcome.css'

export default function Welcome() {
  const [dbStatus, setDbStatus] = useState('checking') // 'checking' | 'ok' | 'error'

  useEffect(() => {
    async function checkConnection() {
      try {
        // Intento de ping a Supabase (tabla que aún no existe devuelve error de tabla, no de conexión)
        const { error } = await supabase.from('mesas').select('count').limit(1)
        // Si el error es de tabla no encontrada, la conexión SÍ funciona
        if (!error || error.code === 'PGRST116' || error.message?.includes('does not exist')) {
          setDbStatus('ok')
        } else if (error.message?.includes('placeholder') || error.message?.includes('Failed to fetch')) {
          setDbStatus('no_env')
        } else {
          setDbStatus('ok') // Cualquier respuesta de Supabase = conexión ok
        }
      } catch {
        setDbStatus('no_env')
      }
    }
    checkConnection()
  }, [])

  const statusLabel = {
    checking: { text: 'Verificando conexión…', color: '#8a6f42', dot: '⏳' },
    ok:       { text: 'Supabase conectado',     color: '#6abf7a', dot: '●' },
    no_env:   { text: 'Configura .env con tus credenciales', color: '#e07b5a', dot: '○' },
    error:    { text: 'Error de conexión',       color: '#e07b5a', dot: '○' },
  }[dbStatus]

  return (
    <div className="welcome">
      {/* Fondo decorativo */}
      <div className="welcome__bg">
        <div className="welcome__grain" />
        <div className="welcome__glow" />
        <div className="welcome__lines" />
      </div>

      {/* Contenido principal */}
      <main className="welcome__main">
        {/* Badge de etapa */}
        <div className="welcome__badge">
          <span className="welcome__badge-dot" />
          Etapa 1 — Configuración inicial
        </div>

        {/* Título */}
        <h1 className="welcome__title">
          <span className="welcome__title-sub">Sistema de</span>
          <span className="welcome__title-main">Reservas</span>
          <span className="welcome__title-accent">◆</span>
        </h1>

        <p className="welcome__description">
          Plataforma de gestión de reservas para restaurante.<br />
          Construida con React, Supabase y desplegada en Vercel.
        </p>

        {/* Stack tecnológico */}
        <div className="welcome__stack">
          {[
            { icon: '⚛', label: 'React 18', sub: 'Interfaz' },
            { icon: '⚡', label: 'Vite',     sub: 'Build tool' },
            { icon: '🗄', label: 'Supabase', sub: 'Base de datos' },
            { icon: '▲', label: 'Vercel',   sub: 'Despliegue' },
          ].map(({ icon, label, sub }) => (
            <div className="welcome__chip" key={label}>
              <span className="welcome__chip-icon">{icon}</span>
              <div>
                <div className="welcome__chip-label">{label}</div>
                <div className="welcome__chip-sub">{sub}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Estado de Supabase */}
        <div className="welcome__status">
          <span className="welcome__status-dot" style={{ color: statusLabel.color }}>
            {statusLabel.dot}
          </span>
          <span style={{ color: statusLabel.color }}>{statusLabel.text}</span>
        </div>

        {/* Próximas etapas */}
        <div className="welcome__roadmap">
          <h2 className="welcome__roadmap-title">Próximas etapas</h2>
          <div className="welcome__roadmap-items">
            {[
              { n: '2', label: 'Autenticación de usuarios' },
              { n: '3', label: 'Gestión de mesas' },
              { n: '4', label: 'Sistema de reservas' },
              { n: '5', label: 'Panel de administración' },
            ].map(({ n, label }) => (
              <div className="welcome__roadmap-item" key={n}>
                <span className="welcome__roadmap-n">{n}</span>
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="welcome__footer">
        <span>Proyecto académico · React + Supabase + Vercel</span>
      </footer>
    </div>
  )
}
