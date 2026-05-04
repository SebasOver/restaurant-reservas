import { createContext, useContext, useState } from 'react'

const AppContext = createContext(null)

/**
 * Proveedor de estado global de la aplicación.
 * Envuelve <App /> en main.jsx para que todos los componentes
 * tengan acceso al contexto.
 */
export function AppProvider({ children }) {
  // Estado global: se expandirá en etapas posteriores (usuario, notificaciones, etc.)
  const [usuario, setUsuario] = useState(null)

  const value = {
    usuario,
    setUsuario,
  }

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  )
}

/**
 * Hook para consumir el contexto global.
 * Uso: const { usuario } = useAppContext()
 */
export function useAppContext() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useAppContext debe usarse dentro de <AppProvider>')
  return ctx
}
