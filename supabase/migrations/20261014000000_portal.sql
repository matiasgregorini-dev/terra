-- =============================================================================
-- Portal de Terra Consultora: usuarios, roles y datos por establecimiento.
--
-- Roles (columna perfiles.rol):
--   admin      Terra Consultora. Ve y administra todo: usuarios, establecimientos,
--              lotes, documentos y novedades.
--   tecnico    Asesor de campo. Ve los establecimientos que tiene asignados y en
--              ellos carga lotes, documentos y novedades.
--   productor  Cliente. Ve sus establecimientos, lotes, documentos y novedades.
--   personal   Encargado o empleado del campo. Ve sus establecimientos y lotes,
--              y solo los documentos y novedades marcados "visible para el personal".
--
-- La seguridad la aplica la base de datos (Row Level Security), no la interfaz:
-- aunque alguien arme una petición a mano, Postgres solo devuelve o modifica las
-- filas que su rol permite.
--
-- Se ejecuta una sola vez en el SQL Editor de Supabase (ver README).
-- =============================================================================

-- -----------------------------------------------------------------------------
-- Tipos
-- -----------------------------------------------------------------------------
create type public.rol as enum ('admin', 'tecnico', 'productor', 'personal');

create type public.categoria_documento as enum (
  'recomendacion',
  'analisis_suelo',
  'plan_siembra',
  'informe',
  'protocolo',
  'dieta',
  'otro'
);

-- -----------------------------------------------------------------------------
-- Tablas
-- -----------------------------------------------------------------------------

-- Un perfil por cada usuario de Supabase Auth.
create table public.perfiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  nombre text not null default '',
  -- Mínimo privilegio: todo usuario nuevo nace como "personal" y sin
  -- establecimientos, es decir, sin acceso a datos hasta que el admin lo asigne.
  rol public.rol not null default 'personal',
  activo boolean not null default true,
  creado_en timestamptz not null default now()
);

create table public.establecimientos (
  id uuid primary key default gen_random_uuid(),
  nombre text not null check (char_length(nombre) between 1 and 120),
  localidad text not null default '',
  partido text not null default '',
  superficie_ha numeric(10, 2) check (superficie_ha is null or superficie_ha > 0),
  notas text not null default '',
  creado_en timestamptz not null default now()
);

-- Qué usuarios tienen acceso a qué establecimientos.
create table public.miembros (
  establecimiento_id uuid not null references public.establecimientos (id) on delete cascade,
  perfil_id uuid not null references public.perfiles (id) on delete cascade,
  creado_en timestamptz not null default now(),
  primary key (establecimiento_id, perfil_id)
);
create index miembros_perfil_idx on public.miembros (perfil_id);

create table public.lotes (
  id uuid primary key default gen_random_uuid(),
  establecimiento_id uuid not null references public.establecimientos (id) on delete cascade,
  nombre text not null check (char_length(nombre) between 1 and 80),
  superficie_ha numeric(10, 2) check (superficie_ha is null or superficie_ha > 0),
  campana text not null default '',   -- p. ej. "2026/27"
  cultivo text not null default '',
  ambiente text not null default '',  -- p. ej. "Loma", "Media loma", "Bajo"
  notas text not null default '',
  creado_en timestamptz not null default now(),
  actualizado_en timestamptz not null default now()
);
create index lotes_establecimiento_idx on public.lotes (establecimiento_id);

create table public.documentos (
  id uuid primary key default gen_random_uuid(),
  establecimiento_id uuid not null references public.establecimientos (id) on delete cascade,
  lote_id uuid references public.lotes (id) on delete set null,
  titulo text not null check (char_length(titulo) between 1 and 160),
  categoria public.categoria_documento not null default 'otro',
  campana text not null default '',
  -- Ruta del archivo en el bucket "documentos": <establecimiento_id>/<uuid>.<ext>
  archivo_path text not null unique,
  archivo_nombre text not null,
  archivo_tipo text not null default '',
  archivo_bytes bigint not null default 0,
  visible_personal boolean not null default false,
  subido_por uuid references public.perfiles (id) on delete set null,
  creado_en timestamptz not null default now(),
  -- El archivo tiene que estar dentro de la carpeta de su establecimiento.
  constraint documentos_path_en_carpeta
    check (split_part(archivo_path, '/', 1) = establecimiento_id::text)
);
create index documentos_establecimiento_idx on public.documentos (establecimiento_id, creado_en desc);

create table public.novedades (
  id uuid primary key default gen_random_uuid(),
  -- null = novedad general, para todos los usuarios.
  establecimiento_id uuid references public.establecimientos (id) on delete cascade,
  titulo text not null check (char_length(titulo) between 1 and 160),
  cuerpo text not null check (char_length(cuerpo) between 1 and 5000),
  visible_personal boolean not null default true,
  autor_id uuid references public.perfiles (id) on delete set null,
  publicado_en timestamptz not null default now()
);
create index novedades_publicado_idx on public.novedades (publicado_en desc);
create index novedades_establecimiento_idx on public.novedades (establecimiento_id);

-- -----------------------------------------------------------------------------
-- Funciones auxiliares para las políticas.
-- SECURITY DEFINER para leer perfiles/miembros sin recursión de RLS;
-- search_path vacío para que no se puedan secuestrar con objetos homónimos.
-- -----------------------------------------------------------------------------
create function public.rol_actual()
returns public.rol
language sql stable security definer set search_path = ''
as $$
  select p.rol from public.perfiles p
  where p.id = auth.uid() and p.activo
$$;

create function public.es_admin()
returns boolean
language sql stable security definer set search_path = ''
as $$
  select coalesce(public.rol_actual() = 'admin', false)
$$;

create function public.es_miembro(est uuid)
returns boolean
language sql stable security definer set search_path = ''
as $$
  select exists (
    select 1
    from public.miembros m
    join public.perfiles p on p.id = m.perfil_id
    where m.establecimiento_id = est
      and m.perfil_id = auth.uid()
      and p.activo
  )
$$;

-- Admin, o técnico asignado al establecimiento.
create function public.puede_cargar(est uuid)
returns boolean
language sql stable security definer set search_path = ''
as $$
  select public.es_admin()
      or (public.rol_actual() = 'tecnico' and public.es_miembro(est))
$$;

-- Admin, o miembro del establecimiento con permiso según el destinatario.
create function public.puede_ver_contenido(est uuid, visible_personal boolean)
returns boolean
language sql stable security definer set search_path = ''
as $$
  select public.es_admin()
      or (
        public.es_miembro(est)
        and (public.rol_actual() <> 'personal' or visible_personal)
      )
$$;

revoke execute on function
  public.rol_actual(), public.es_admin(), public.es_miembro(uuid),
  public.puede_cargar(uuid), public.puede_ver_contenido(uuid, boolean)
  from public, anon;
grant execute on function
  public.rol_actual(), public.es_admin(), public.es_miembro(uuid),
  public.puede_cargar(uuid), public.puede_ver_contenido(uuid, boolean)
  to authenticated;

-- -----------------------------------------------------------------------------
-- Triggers
-- -----------------------------------------------------------------------------

-- Crea el perfil al dar de alta un usuario en Supabase Auth. El rol NO se toma
-- de los metadatos (que el propio usuario puede editar): siempre arranca en
-- "personal" y lo cambia el administrador.
create function public.crear_perfil()
returns trigger
language plpgsql security definer set search_path = ''
as $$
begin
  insert into public.perfiles (id, email, nombre)
  values (
    new.id,
    coalesce(new.email, ''),
    left(coalesce(new.raw_user_meta_data ->> 'nombre', ''), 120)
  );
  return new;
end;
$$;

create trigger al_crear_usuario
  after insert on auth.users
  for each row execute function public.crear_perfil();

-- Un usuario puede editar su nombre, pero solo un admin (o el servidor con la
-- clave secreta, que no tiene auth.uid()) puede cambiar rol, estado o email.
create function public.proteger_perfil()
returns trigger
language plpgsql security definer set search_path = ''
as $$
begin
  if auth.uid() is not null and not public.es_admin() then
    if new.rol is distinct from old.rol
       or new.activo is distinct from old.activo
       or new.email is distinct from old.email
       or new.id is distinct from old.id then
      raise exception 'Solo un administrador puede cambiar rol, estado o email'
        using errcode = '42501';
    end if;
  end if;
  -- Un admin no puede quitarse a sí mismo el rol ni desactivarse (evita
  -- quedarse sin ningún administrador por error).
  if auth.uid() = old.id and old.rol = 'admin'
     and (new.rol <> 'admin' or not new.activo) then
    raise exception 'No podés quitarte el rol de administrador ni desactivarte'
      using errcode = '42501';
  end if;
  return new;
end;
$$;

create trigger proteger_perfil
  before update on public.perfiles
  for each row execute function public.proteger_perfil();

create function public.tocar_actualizado_en()
returns trigger
language plpgsql set search_path = ''
as $$
begin
  new.actualizado_en = now();
  return new;
end;
$$;

create trigger lotes_actualizado_en
  before update on public.lotes
  for each row execute function public.tocar_actualizado_en();

-- -----------------------------------------------------------------------------
-- Row Level Security
-- -----------------------------------------------------------------------------
alter table public.perfiles enable row level security;
alter table public.establecimientos enable row level security;
alter table public.miembros enable row level security;
alter table public.lotes enable row level security;
alter table public.documentos enable row level security;
alter table public.novedades enable row level security;

-- Los visitantes anónimos no tienen ningún acceso.
revoke all on public.perfiles, public.establecimientos, public.miembros,
  public.lotes, public.documentos, public.novedades from anon;

-- perfiles ---------------------------------------------------------------------
create policy "perfiles: ver el propio o todos si es admin"
  on public.perfiles for select to authenticated
  using (id = (select auth.uid()) or (select public.es_admin()));

create policy "perfiles: editar el propio o cualquiera si es admin"
  on public.perfiles for update to authenticated
  using (id = (select auth.uid()) or (select public.es_admin()))
  with check (id = (select auth.uid()) or (select public.es_admin()));
-- Altas y bajas de perfiles: solo por trigger o desde el servidor (clave secreta).

-- establecimientos -------------------------------------------------------------
create policy "establecimientos: ver si es admin o miembro"
  on public.establecimientos for select to authenticated
  using ((select public.es_admin()) or public.es_miembro(id));

create policy "establecimientos: alta por admin"
  on public.establecimientos for insert to authenticated
  with check ((select public.es_admin()));

create policy "establecimientos: edición por admin"
  on public.establecimientos for update to authenticated
  using ((select public.es_admin())) with check ((select public.es_admin()));

create policy "establecimientos: baja por admin"
  on public.establecimientos for delete to authenticated
  using ((select public.es_admin()));

-- miembros ---------------------------------------------------------------------
create policy "miembros: ver los propios o todos si es admin"
  on public.miembros for select to authenticated
  using (perfil_id = (select auth.uid()) or (select public.es_admin()));

create policy "miembros: alta por admin"
  on public.miembros for insert to authenticated
  with check ((select public.es_admin()));

create policy "miembros: baja por admin"
  on public.miembros for delete to authenticated
  using ((select public.es_admin()));

-- lotes ------------------------------------------------------------------------
create policy "lotes: ver si es admin o miembro"
  on public.lotes for select to authenticated
  using ((select public.es_admin()) or public.es_miembro(establecimiento_id));

create policy "lotes: alta por admin o técnico asignado"
  on public.lotes for insert to authenticated
  with check (public.puede_cargar(establecimiento_id));

create policy "lotes: edición por admin o técnico asignado"
  on public.lotes for update to authenticated
  using (public.puede_cargar(establecimiento_id))
  with check (public.puede_cargar(establecimiento_id));

create policy "lotes: baja por admin"
  on public.lotes for delete to authenticated
  using ((select public.es_admin()));

-- documentos -------------------------------------------------------------------
create policy "documentos: ver según rol y visibilidad"
  on public.documentos for select to authenticated
  using (public.puede_ver_contenido(establecimiento_id, visible_personal));

create policy "documentos: alta por admin o técnico asignado"
  on public.documentos for insert to authenticated
  with check (
    public.puede_cargar(establecimiento_id)
    and subido_por = (select auth.uid())
  );

create policy "documentos: baja por admin o por quien lo subió"
  on public.documentos for delete to authenticated
  using (
    (select public.es_admin())
    or (subido_por = (select auth.uid()) and public.puede_cargar(establecimiento_id))
  );

-- novedades --------------------------------------------------------------------
create policy "novedades: ver generales o del establecimiento, según rol"
  on public.novedades for select to authenticated
  using (
    (select public.es_admin())
    or (
      establecimiento_id is null
      and (select public.rol_actual()) is not null
      and ((select public.rol_actual()) <> 'personal' or visible_personal)
    )
    or (
      establecimiento_id is not null
      and public.puede_ver_contenido(establecimiento_id, visible_personal)
    )
  );

-- Las generales solo las publica el admin; las de un establecimiento, también
-- el técnico asignado.
create policy "novedades: alta por admin o técnico asignado"
  on public.novedades for insert to authenticated
  with check (
    autor_id = (select auth.uid())
    and (
      (select public.es_admin())
      or (establecimiento_id is not null and public.puede_cargar(establecimiento_id))
    )
  );

create policy "novedades: baja por admin o por su autor"
  on public.novedades for delete to authenticated
  using ((select public.es_admin()) or autor_id = (select auth.uid()));

-- -----------------------------------------------------------------------------
-- Almacenamiento de archivos (Supabase Storage)
-- Bucket privado: los archivos solo se descargan con un enlace firmado que
-- vence en 60 segundos, generado después de comprobar el permiso.
-- -----------------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'documentos',
  'documentos',
  false,
  26214400, -- 25 MB
  array[
    'application/pdf',
    'image/jpeg',
    'image/png',
    'image/webp',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/msword',
    'text/csv',
    'application/zip',
    'application/vnd.google-earth.kmz',
    'application/vnd.google-earth.kml+xml'
  ]
)
on conflict (id) do nothing;

-- Subir: dentro de la carpeta de un establecimiento donde puede cargar.
create policy "documentos (archivos): subir admin o técnico asignado"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'documentos'
    and public.puede_cargar(((storage.foldername(name))[1])::uuid)
  );

-- Leer: solo si puede ver la fila del documento que apunta a ese archivo
-- (la subconsulta respeta el RLS de public.documentos).
create policy "documentos (archivos): leer si puede ver el documento"
  on storage.objects for select to authenticated
  using (
    bucket_id = 'documentos'
    and exists (select 1 from public.documentos d where d.archivo_path = name)
  );

-- Borrar: no hay política para usuarios. Los archivos los elimina el servidor
-- con la clave secreta, solo después de que la base autorizó borrar la fila
-- del documento (ver lib/portal/acciones/contenido.ts).
