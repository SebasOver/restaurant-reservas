-- ================================================================
-- POLÍTICAS RLS PARA EL PANEL DE ADMINISTRACIÓN
-- Ejecutar en el SQL Editor de Supabase
-- ================================================================

-- Permite a usuarios autenticados (admins) leer y escribir mesas
create policy "mesas_admin"
  on public.mesas for all
  to authenticated
  using (true)
  with check (true);

-- Permite a usuarios autenticados leer y escribir horarios
create policy "horarios_admin"
  on public.horarios for all
  to authenticated
  using (true)
  with check (true);

-- Permite a usuarios autenticados leer, escribir y eliminar reservas
create policy "reservas_admin"
  on public.reservas for all
  to authenticated
  using (true)
  with check (true);

