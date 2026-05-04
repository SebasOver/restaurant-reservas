# 🍽️ Sistema de Reservas — Restaurante

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

## 🚀 Configuración paso a paso

### 1. Instalar dependencias
```bash
npm install
```

### 2. Configurar Supabase
1. Crea un proyecto en [supabase.com](https://supabase.com)
2. Ve a **SQL Editor** y ejecuta `supabase/schema.sql`
3. Copia tu `Project URL` y `anon key` desde **Settings → API**

### 3. Variables de entorno
```bash
cp .env.example .env
# Edita .env con tus credenciales
```

```env
VITE_SUPABASE_URL=https://TU_PROYECTO.supabase.co
VITE_SUPABASE_ANON_KEY=tu_anon_key_aqui
```

### 4. Ejecutar localmente
```bash
npm run dev
# Abre http://localhost:5173
```

---

## ☁️ Despliegue en Vercel

```bash
# 1. Subir a GitHub
git init
git add .
git commit -m "feat: etapa 1 - configuracion inicial"
git remote add origin https://github.com/TU_USUARIO/restaurant-reservas.git
git push -u origin main
```

2. En [vercel.com](https://vercel.com) → **New Project** → importar repo
3. Agregar variables de entorno (`VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`)
4. **Deploy** ✅

Cada `git push` a `main` despliega automáticamente.

---

## ✅ Checklist Etapa 1

- [x] Repositorio creado en GitHub
- [x] Proyecto React inicializado con Vite
- [x] Estructura de carpetas completa (components, pages, services, hooks, context, styles, utils)
- [x] Supabase configurado — tablas `mesas`, `horarios`, `reservas` con RLS
- [x] Datos de ejemplo insertados
- [x] Variables de entorno configuradas
- [x] Despliegue en Vercel funcionando
- [x] Página de bienvenida visible

---

## 🗺️ Roadmap

| Etapa | Descripción |
|-------|-------------|
| **1** ✅ | Configuración inicial |
| 2 | Autenticación de usuarios |
| 3 | Gestión de mesas |
| 4 | Sistema de reservas |
| 5 | Panel de administración |
