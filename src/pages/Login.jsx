import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { signIn } from '../services/authService'
import { useAuth } from '../hooks/useAuth'
import './Login.css'

export default function Login() {
  const { user, loading } = useAuth()
  const navigate = useNavigate()
  const [form, setForm]   = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [busy, setBusy]   = useState(false)

  // Si ya está logueado, redirigir al admin
  if (!loading && user) {
    navigate('/admin/reservas', { replace: true })
    return null
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setBusy(true)
    try {
      await signIn(form.email.trim(), form.password)
      navigate('/admin/reservas', { replace: true })
    } catch (err) {
      setError('Credenciales incorrectas. Verifica tu email y contraseña.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">
          <span className="login-logo__the">THE</span>
          <span className="login-logo__gordo">GORDO</span>
          <span className="login-logo__sub">Panel de administración</span>
        </div>

        <form className="login-form" onSubmit={handleSubmit} noValidate>
          <div className="login-field">
            <label className="login-label">Correo electrónico</label>
            <input
              className="login-input"
              type="email"
              value={form.email}
              onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
              placeholder="admin@thegordo.com"
              autoComplete="email"
              required
            />
          </div>

          <div className="login-field">
            <label className="login-label">Contraseña</label>
            <input
              className="login-input"
              type="password"
              value={form.password}
              onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
              placeholder="••••••••"
              autoComplete="current-password"
              required
            />
          </div>

          {error && <div className="login-error">{error}</div>}

          <button className="login-btn" type="submit" disabled={busy}>
            {busy ? 'Ingresando…' : 'Ingresar'}
          </button>
        </form>

        <a className="login-back" href="/">← Volver al sitio</a>
      </div>
    </div>
  )
}
