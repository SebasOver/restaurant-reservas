
create extension if not exists "uuid-ossp";
-- ================================================================
-- TABLA: mesas
-- ================================================================
create table public.mesas (
  id          uuid        primary key default uuid_generate_v4(),
  numero      integer     not null unique,
  capacidad   integer     not null,
  ubicacion   text,
  estado      text        not null default 'disponible'
                check (estado in ('disponible', 'ocupada', 'bloqueada')),
  created_at  timestamp   not null default now()
);

comment on table  public.mesas             is 'Mesas del restaurante';
comment on column public.mesas.numero      is 'Número visible de la mesa en el salón';
comment on column public.mesas.capacidad   is 'Máxima cantidad de personas que admite';
comment on column public.mesas.ubicacion   is 'Zona del salón donde está la mesa';
comment on column public.mesas.estado      is 'Estado actual: disponible, ocupada, bloqueada';


-- ================================================================
-- TABLA: horarios
-- ================================================================
create table public.horarios (
  id          uuid        primary key default uuid_generate_v4(),
  dia_semana  text        not null
                check (dia_semana in ('lunes','martes','miercoles','jueves','viernes','sabado','domingo')),
  hora_inicio time        not null,
  hora_fin    time        not null,
  activo      boolean     not null default true
);

comment on table  public.horarios            is 'Días y rangos horarios habilitados para reservas';
comment on column public.horarios.dia_semana is 'Día de la semana habilitado';
comment on column public.horarios.hora_inicio is 'Hora de apertura del turno';
comment on column public.horarios.hora_fin   is 'Hora de cierre del turno';
comment on column public.horarios.activo     is 'Indica si el horario está vigente';


-- ================================================================
-- TABLA: reservas
-- Relación: 1 mesa → N reservas (campo mesa_id)
-- ================================================================
create table public.reservas (
  id              uuid      primary key default uuid_generate_v4(),
  mesa_id         uuid      references public.mesas(id) on delete set null,
  cliente_nombre  text      not null,
  cliente_tel     text,
  cliente_email   text,
  fecha           date      not null,
  hora            time      not null,
  num_personas    integer   not null,
  estado          text      not null default 'activa'
                    check (estado in ('activa', 'cancelada', 'completada')),
  created_at      timestamp not null default now()
);

comment on table  public.reservas              is 'Reservas realizadas por clientes';
comment on column public.reservas.mesa_id      is 'FK → mesas.id';
comment on column public.reservas.cliente_nombre is 'Nombre completo del cliente';
comment on column public.reservas.cliente_tel  is 'Teléfono de contacto';
comment on column public.reservas.cliente_email is 'Correo electrónico del cliente';
comment on column public.reservas.fecha        is 'Fecha de la reserva';
comment on column public.reservas.hora         is 'Hora de inicio de la reserva';
comment on column public.reservas.num_personas is 'Cantidad de personas que asistirán';
comment on column public.reservas.estado       is 'activa, cancelada, completada';


-- ================================================================
-- ROW LEVEL SECURITY (RLS)
-- ================================================================
alter table public.mesas    enable row level security;
alter table public.horarios enable row level security;
alter table public.reservas enable row level security;

-- Mesas y horarios: lectura pública (el formulario los necesita)
create policy "mesas_lectura_publica"    on public.mesas    for select using (true);
create policy "horarios_lectura_publica" on public.horarios for select using (true);

-- Reservas: INSERT público (clientes crean reservas sin cuenta)
-- SELECT y UPDATE solo para admins autenticados (ver admin_rls.sql)
create policy "reservas_insertar" on public.reservas for insert with check (true);


-- ================================================================
-- DATOS DE EJEMPLO
-- ================================================================
insert into public.mesas (numero, capacidad, ubicacion, estado) values
  (1, 2, 'Zona ventana',  'disponible'),
  (2, 4, 'Zona ventana',  'disponible'),
  (3, 4, 'Interior',      'disponible'),
  (4, 6, 'Interior',      'disponible'),
  (5, 8, 'Salón privado', 'disponible');

insert into public.horarios (dia_semana, hora_inicio, hora_fin, activo) values
  ('lunes',     '12:00', '15:00', true),
  ('lunes',     '19:00', '23:00', true),
  ('martes',    '12:00', '15:00', true),
  ('martes',    '19:00', '23:00', true),
  ('miercoles', '12:00', '15:00', true),
  ('miercoles', '19:00', '23:00', true),
  ('jueves',    '12:00', '15:00', true),
  ('jueves',    '19:00', '23:30', true),
  ('viernes',   '12:00', '15:00', true),
  ('viernes',   '19:00', '23:59', true),
  ('sabado',    '13:00', '23:59', true),
  ('domingo',   '13:00', '22:00', true);
