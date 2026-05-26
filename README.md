# Sistema de Reservas — The Gordo Restaurant

Sistema web de reservas de mesas para restaurante, con panel de administración protegido.

## Stack tecnológico

| Capa | Tecnología | Rol |
|------|-----------|-----|
| Frontend | React 18 + CSS puro | Interfaz de usuario, estado local |
| Routing | React Router DOM 6 | Navegación SPA |
| Lógica de negocio | JavaScript ES6+ | Validaciones, disponibilidad, errores |
| Backend / Datos | Supabase (PostgreSQL + Auth + REST) | Mesas, reservas, horarios, autenticación |
| Despliegue | Vercel + GitHub | CI/CD — cada push a `main` despliega automáticamente |

---

## Estructura del proyecto

```
restaurant-reservas/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── ProtectedRoute.jsx    # Guard de rutas admin (requiere rol admin)
│   │   └── ReservaForm.jsx       # Formulario público de reservas
│   ├── context/
│   │   └── AppContext.jsx        # Estado global (Context API)
│   ├── hooks/
│   │   ├── useAuth.js            # Sesión + verificación de rol admin
│   │   ├── useMesas.js
│   │   └── useReservas.js
│   ├── lib/
│   │   └── supabase.js           # Cliente Supabase
│   ├── pages/
│   │   ├── Home.jsx              # Página pública con formulario de reservas
│   │   ├── Welcome.jsx           # Pantalla de bienvenida
│   │   ├── Login.jsx             # Login del panel admin
│   │   ├── Admin.jsx             # Layout del panel admin (sidebar + outlet)
│   │   └── admin/
│   │       ├── ReservasAdmin.jsx
│   │       ├── MesasAdmin.jsx
│   │       └── HorariosAdmin.jsx
│   ├── services/
│   │   ├── authService.js        # signIn / signOut / getSession
│   │   ├── mesasService.js
│   │   ├── horariosService.js
│   │   └── reservasService.js
│   ├── styles/
│   │   └── global.css
│   ├── utils/
│   │   ├── fechas.js
│   │   └── validaciones.js       # Validaciones del formulario (frontend)
│   ├── App.jsx
│   └── main.jsx
├── supabase/
│   ├── schema.sql                # Tablas, RLS base y datos de ejemplo
│   └── admin_rls.sql             # Tabla admins, función is_admin() y políticas admin
├── .env.example
├── .gitignore
├── index.html
├── package.json
└── vite.config.js
```

---

## Base de datos (Supabase)

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

### Tabla: `admins`
| Campo | Tipo | Descripción |
|-------|------|-------------|
| user_id | UUID (PK, FK) | Referencia a `auth.users(id)` |
| email | TEXT | Email del administrador |

### Relaciones
- **1 mesa → N reservas** (`mesa_id` en `reservas`)
- **Los horarios son globales** — independientes de las mesas
- **1 usuario de Auth → 1 registro en admins** (para rol de administrador)

---

## Seguridad (Row Level Security)

| Tabla | Operación | Quién puede |
|-------|-----------|-------------|
| `mesas` | SELECT | Público (necesario para el formulario) |
| `mesas` | INSERT / UPDATE / DELETE | Solo admins |
| `horarios` | SELECT | Público |
| `horarios` | INSERT / UPDATE / DELETE | Solo admins |
| `reservas` | INSERT | Público (clientes crean reservas sin cuenta) |
| `reservas` | SELECT / UPDATE / DELETE | Solo admins |
| `admins` | SELECT | Solo el propio admin (ve su propio registro) |

El rol de admin se verifica mediante la función PostgreSQL `is_admin()`, que comprueba si el `auth.uid()` del usuario autenticado está en la tabla `admins`. Esto protege las operaciones tanto a nivel de base de datos como en el frontend.

---

## Variables de entorno

Copia `.env.example` a `.env` y completa los valores:

```env
VITE_SUPABASE_URL=https://<tu-proyecto>.supabase.co
VITE_SUPABASE_ANON_KEY=<tu-anon-key>
```

Las variables `VITE_*` son visibles en el bundle del navegador — esto es normal para la `anon key` de Supabase (es pública por diseño). La seguridad real la provee RLS en la base de datos.

---

## Configuración inicial en Supabase

1. Ejecuta `supabase/schema.sql` en el SQL Editor de Supabase.
2. Ejecuta `supabase/admin_rls.sql` en el SQL Editor de Supabase.
3. Crea el usuario administrador en **Authentication > Users** del Dashboard de Supabase.
4. Copia el UUID del usuario creado y ejecuta en el SQL Editor:

```sql
insert into public.admins (user_id, email)
values ('<UUID del usuario>', '<email del admin>');
```

---

## Credenciales del panel de administración

| Campo | Valor |
|-------|-------|
| Email | johansebastiantarazonadiaz@gmail.com |
| Contraseña | sebast17 |
| URL del panel | `/admin/login` |

---

## Desarrollo local

```bash
npm install
cp .env.example .env   # Completa con tus credenciales de Supabase
npm run dev
```

## Despliegue

El proyecto se despliega automáticamente en Vercel con cada push a `main`. Configura las variables de entorno `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` en el Dashboard de Vercel.
