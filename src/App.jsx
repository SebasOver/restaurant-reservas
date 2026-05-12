import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Welcome from './pages/Welcome.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/bienvenida" element={<Welcome />} />
    </Routes>
  )
}
