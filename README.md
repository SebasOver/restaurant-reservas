# 🍽️ Sistema de Reservas — Restaurante - Johan Tarazona - 01220371054

> **Etapa 1 completada:** Proyecto ejecutándose localmente y desplegado en Vercel.

## 🛠️ Stack tecnológico

| Capa | Tecnología | Rol |
|------|-----------|-----|
| Presentación | React 18 + CSS | Interfaz de usuario, estado local |
| Lógica de negocio | JavaScript ES6+ | Validaciones, disponibilidad, errores |
| Datos (Backend) | Supabase (PostgreSQL + REST) | Mesas, reservas, horarios, auth |
| Despliegue | Vercel + GitHub | CI/CD — cada push a main despliega |

---

## 📁 Estructura del proyecto

```
restaurant-reservas/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/          -- Componentes reutilizables de UI
│   ├── pages/               -- Páginas principales (Home, Admin, etc.)
│   │   ├── Welcome.jsx      -- Pantalla de bienvenida (Etapa 1)
│   │   └── Welcome.css
│   ├── services/            -- Lógica de comunicación con Supabase
│   │   ├── mesasService.js
│   │   ├── reservasService.js
│   │   └── horariosService.js
│   ├── hooks/               -- Custom hooks de React
│   │   ├── useMesas.js
│   │   └── useReservas.js
│   ├── context/             -- Estado global (Context API)
│   │   └── AppContext.jsx
│   ├── styles/              -- Archivos CSS
│   │   └── global.css
│   ├── utils/               -- Funciones auxiliares
│   │   ├── fechas.js
│   │   └── validaciones.js
│   ├── lib/
│   │   └── supabase.js      -- Cliente Supabase
│   ├── App.jsx
│   └── main.jsx
├── supabase/
│   └── schema.sql           -- Esquema de base de datos
├── .env.example
├── .gitignore
├── index.html
├── package.json
└── vite.config.js
```

---

## 🗄️ Base de datos (Supabase)

### Tabla: `mesas`
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID (auto) | Identificador único |
| numero | INTEGER | Número visible de la mesa |
| capacidad | INTEGER | Máx. personas que admite |
| ubicacion | TEXT | Zona del salón (ej: Zona ventana) |
| estado | TEXT | `disponible` / `ocupada` / `bloqueada` |
| created_at | TIMESTAMP | Fecha de creación |

### Tabla: `horarios`
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID (auto) | Identificador único |
| dia_semana | TEXT | `lunes` … `domingo` |
| hora_inicio | TIME | Apertura del turno |
| hora_fin | TIME | Cierre del turno |
| activo | BOOLEAN | Si el horario está vigente |

### Tabla: `reservas`
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID (auto) | Identificador único |
| mesa_id | UUID (FK) | Referencia a `mesas.id` |
| cliente_nombre | TEXT | Nombre completo |
| cliente_tel | TEXT | Teléfono de contacto |
| cliente_email | TEXT | Correo electrónico |
| fecha | DATE | Fecha de la reserva |
| hora | TIME | Hora de inicio |
| num_personas | INTEGER | Personas que asistirán |
| estado | TEXT | `activa` / `cancelada` / `completada` |
| created_at | TIMESTAMP | Fecha de creación |

### Relaciones
- **1 mesa → N reservas** (campo `mesa_id` en `reservas`)
- **Los horarios son globales** — independientes de las mesas

---
