import { Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Welcome from './pages/Welcome.jsx'
import Login from './pages/Login.jsx'
import Admin from './pages/Admin.jsx'
import ReservasAdmin from './pages/admin/ReservasAdmin.jsx'
import MesasAdmin from './pages/admin/MesasAdmin.jsx'
import HorariosAdmin from './pages/admin/HorariosAdmin.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'

export default function App() {
  return (
    <Routes>
      {/* Sitio público */}
      <Route path="/" element={<Home />} />
      <Route path="/bienvenida" element={<Welcome />} />

      {/* Auth */}
      <Route path="/admin/login" element={<Login />} />

      {/* Panel admin (protegido) */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <Admin />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/admin/reservas" replace />} />
        <Route path="reservas" element={<ReservasAdmin />} />
        <Route path="mesas"    element={<MesasAdmin />} />
        <Route path="horarios" element={<HorariosAdmin />} />
      </Route>
    </Routes>
  )
}
