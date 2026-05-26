import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function ProtectedRoute({ children }) {
  const { user, isAdmin, loading } = useAuth()

  if (loading) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        height: '100vh', background: '#0F0C08', color: '#7A6E60',
        fontFamily: 'DM Sans, sans-serif', fontSize: '0.9rem',
      }}>
        Verificando sesión…
      </div>
    )
  }

  if (!user || !isAdmin) return <Navigate to="/admin/login" replace />

  return children
}
