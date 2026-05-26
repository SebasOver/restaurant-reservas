import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { signOut } from '../services/authService'
import { useAuth } from '../hooks/useAuth'
import './Admin.css'

const NAV = [
  { to: '/admin/reservas', label: 'Reservas',  icon: '📋' },
  { to: '/admin/mesas',    label: 'Mesas',     icon: '🪑' },
  { to: '/admin/horarios', label: 'Horarios',  icon: '🕐' },
]

export default function Admin() {
  const { user } = useAuth()
  const navigate = useNavigate()

  async function handleSignOut() {
    await signOut()
    navigate('/admin/login', { replace: true })
  }

  return (
    <div className="adm">
      {/* ── SIDEBAR ── */}
      <aside className="adm-side">
        <div className="adm-side__logo" onClick={() => navigate('/admin/reservas')}>
          <span className="adm-side__logo-the">THE</span>
          <span className="adm-side__logo-gordo">GORDO</span>
          <span className="adm-side__logo-sub">Admin</span>
        </div>

        <nav className="adm-side__nav">
          {NAV.map(({ to, label, icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `adm-side__link ${isActive ? 'adm-side__link--active' : ''}`
              }
            >
              <span className="adm-side__link-icon">{icon}</span>
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="adm-side__footer">
          <span className="adm-side__email">
            {user?.email?.replace(/^(.{2}).+(@.+)$/, '$1***$2')}
          </span>
          <button className="adm-side__logout" onClick={handleSignOut}>
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* ── CONTENIDO ── */}
      <main className="adm-main">
        <Outlet />
      </main>
    </div>
  )
}
