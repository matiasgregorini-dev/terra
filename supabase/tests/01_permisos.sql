-- Pruebas de permisos (RLS) por rol. Cada línea "ok:" es una regla verificada;
-- ante el primer incumplimiento se corta con "FALLA". Ver supabase/tests/README.md.
\set ON_ERROR_STOP 1
create schema t; grant usage on schema t to authenticated, anon;
create function t.eq(actual bigint, expected bigint, msg text) returns void language plpgsql as $$
begin if actual is distinct from expected then raise exception 'FALLA: % (obtuvo %, esperaba %)', msg, actual, expected; end if; raise notice 'ok: %', msg; end $$;
create function t.falla(sql text, msg text) returns void language plpgsql as $$
begin begin execute sql; exception when others then raise notice 'ok: % (rechazado: %)', msg, sqlerrm; return; end;
raise exception 'FALLA: % (no fue rechazado)', msg; end $$;
grant execute on all functions in schema t to authenticated, anon;

-- Usuarios (el trigger crea los perfiles como "personal")
insert into auth.users (id, email, raw_user_meta_data) values
 ('00000000-0000-0000-0000-00000000000a','admin@x','{"nombre":"Admin"}'),
 ('00000000-0000-0000-0000-00000000000b','tec@x','{"nombre":"Tec","rol":"admin"}'),
 ('00000000-0000-0000-0000-00000000000c','prod@x','{}'),
 ('00000000-0000-0000-0000-00000000000d','pers@x','{}'),
 ('00000000-0000-0000-0000-00000000000e','otro@x','{}');
select t.eq((select count(*) from public.perfiles where rol='personal'), 5, 'perfiles nacen como personal aunque metadata diga admin');
update public.perfiles set rol='admin' where email='admin@x';
update public.perfiles set rol='tecnico' where email='tec@x';
update public.perfiles set rol='productor' where email in ('prod@x','otro@x');

insert into public.establecimientos (id, nombre) values
 ('11111111-1111-1111-1111-111111111111','La Esperanza'),
 ('22222222-2222-2222-2222-222222222222','El Otro');
insert into public.miembros values
 ('11111111-1111-1111-1111-111111111111','00000000-0000-0000-0000-00000000000b'),
 ('11111111-1111-1111-1111-111111111111','00000000-0000-0000-0000-00000000000c'),
 ('11111111-1111-1111-1111-111111111111','00000000-0000-0000-0000-00000000000d'),
 ('22222222-2222-2222-2222-222222222222','00000000-0000-0000-0000-00000000000e');
insert into public.lotes (establecimiento_id, nombre) values ('11111111-1111-1111-1111-111111111111','Lote 1'),('22222222-2222-2222-2222-222222222222','Lote X');
insert into public.documentos (establecimiento_id, titulo, archivo_path, archivo_nombre, visible_personal) values
 ('11111111-1111-1111-1111-111111111111','Reservado','11111111-1111-1111-1111-111111111111/a.pdf','a.pdf',false),
 ('11111111-1111-1111-1111-111111111111','Protocolo','11111111-1111-1111-1111-111111111111/b.pdf','b.pdf',true),
 ('22222222-2222-2222-2222-222222222222','Ajeno','22222222-2222-2222-2222-222222222222/c.pdf','c.pdf',true);
insert into storage.objects (bucket_id, name) select 'documentos', archivo_path from public.documentos;
insert into public.novedades (establecimiento_id, titulo, cuerpo, visible_personal) values
 (null,'General todos','x',true),(null,'General sin personal','x',false),
 ('11111111-1111-1111-1111-111111111111','Est1','x',true),('22222222-2222-2222-2222-222222222222','Est2','x',true);
select t.falla($$insert into public.documentos (establecimiento_id, titulo, archivo_path, archivo_nombre) values ('11111111-1111-1111-1111-111111111111','x','22222222-2222-2222-2222-222222222222/z.pdf','z')$$, 'path fuera de la carpeta del establecimiento');

-- ANÓNIMO
begin; set local role anon;
select t.falla('select * from public.perfiles', 'anónimo no puede leer perfiles');
rollback;

-- PERSONAL (d)
begin; set local role authenticated; set local request.jwt.claim.sub = '00000000-0000-0000-0000-00000000000d';
select t.eq((select count(*) from public.establecimientos), 1, 'personal ve solo su establecimiento');
select t.eq((select count(*) from public.lotes), 1, 'personal ve lotes de su establecimiento');
select t.eq((select count(*) from public.documentos), 1, 'personal ve solo documentos visibles para personal');
select t.eq((select count(*) from storage.objects), 1, 'personal solo accede al archivo visible');
select t.eq((select count(*) from public.novedades), 2, 'personal: general visible + su establecimiento');
select t.eq((select count(*) from public.perfiles), 1, 'personal ve solo su perfil');
update public.perfiles set nombre='Nuevo' where id = auth.uid();
select t.falla($$update public.perfiles set rol='admin' where id = auth.uid()$$, 'personal no puede autopromoverse');
with x as (update public.perfiles set nombre='hack' where email='admin@x' returning 1) select t.eq((select count(*) from x), 0, 'personal no edita perfiles ajenos');
select t.falla($$insert into public.lotes (establecimiento_id, nombre) values ('11111111-1111-1111-1111-111111111111','x')$$, 'personal no carga lotes');
select t.falla($$insert into public.miembros values ('22222222-2222-2222-2222-222222222222', auth.uid())$$, 'personal no se asigna establecimientos');
rollback;

-- PRODUCTOR (c)
begin; set local role authenticated; set local request.jwt.claim.sub = '00000000-0000-0000-0000-00000000000c';
select t.eq((select count(*) from public.documentos), 2, 'productor ve todos los documentos de su establecimiento');
select t.eq((select count(*) from public.novedades), 3, 'productor: 2 generales + su establecimiento');
select t.falla($$insert into public.novedades (titulo, cuerpo, autor_id) values ('x','x', auth.uid())$$, 'productor no publica novedades');
select t.falla($$insert into storage.objects (bucket_id, name) values ('documentos','11111111-1111-1111-1111-111111111111/z.pdf')$$, 'productor no sube archivos');
with x as (delete from public.documentos returning 1) select t.eq((select count(*) from x), 0, 'productor no borra documentos');
rollback;

-- TÉCNICO (b)
begin; set local role authenticated; set local request.jwt.claim.sub = '00000000-0000-0000-0000-00000000000b';
select t.eq((select count(*) from public.establecimientos), 1, 'técnico ve solo asignados');
insert into public.lotes (establecimiento_id, nombre) values ('11111111-1111-1111-1111-111111111111','Lote 2');
select t.falla($$insert into public.lotes (establecimiento_id, nombre) values ('22222222-2222-2222-2222-222222222222','x')$$, 'técnico no carga en establecimiento ajeno');
insert into storage.objects (bucket_id, name) values ('documentos','11111111-1111-1111-1111-111111111111/nuevo.pdf');
select t.falla($$insert into storage.objects (bucket_id, name) values ('documentos','22222222-2222-2222-2222-222222222222/z.pdf')$$, 'técnico no sube a carpeta ajena');
insert into public.documentos (establecimiento_id, titulo, archivo_path, archivo_nombre, subido_por) values ('11111111-1111-1111-1111-111111111111','Nuevo','11111111-1111-1111-1111-111111111111/nuevo.pdf','n.pdf', auth.uid());
select t.falla($$insert into public.documentos (establecimiento_id, titulo, archivo_path, archivo_nombre, subido_por) values ('11111111-1111-1111-1111-111111111111','x','11111111-1111-1111-1111-111111111111/y.pdf','y','00000000-0000-0000-0000-00000000000a')$$, 'técnico no puede firmar como otro usuario');
insert into public.novedades (establecimiento_id, titulo, cuerpo, autor_id) values ('11111111-1111-1111-1111-111111111111','Tec','x', auth.uid());
select t.falla($$insert into public.novedades (titulo, cuerpo, autor_id) values ('x','x', auth.uid())$$, 'técnico no publica novedades generales');
with x as (delete from public.documentos where titulo='Reservado' returning 1) select t.eq((select count(*) from x), 0, 'técnico no borra documentos que no subió');
with x as (delete from public.lotes returning 1) select t.eq((select count(*) from x), 0, 'técnico no borra lotes');
rollback;

-- PRODUCTOR DESACTIVADO (e)
update public.perfiles set activo=false where email='otro@x';
begin; set local role authenticated; set local request.jwt.claim.sub = '00000000-0000-0000-0000-00000000000e';
select t.eq((select count(*) from public.establecimientos), 0, 'desactivado no ve establecimientos');
select t.eq((select count(*) from public.novedades), 0, 'desactivado no ve novedades');
rollback;

-- ADMIN (a)
begin; set local role authenticated; set local request.jwt.claim.sub = '00000000-0000-0000-0000-00000000000a';
select t.eq((select count(*) from public.establecimientos), 2, 'admin ve todo');
select t.eq((select count(*) from public.documentos), 3, 'admin ve todos los documentos');
select t.eq((select count(*) from public.perfiles), 5, 'admin ve todos los perfiles');
update public.perfiles set rol='tecnico' where email='prod@x';
insert into public.miembros values ('22222222-2222-2222-2222-222222222222','00000000-0000-0000-0000-00000000000c');
insert into public.novedades (titulo, cuerpo, autor_id) values ('Gral','x', auth.uid());
select t.falla($$update public.perfiles set rol='productor' where id = auth.uid()$$, 'admin no puede quitarse el rol');
select t.falla($$update public.perfiles set activo=false where id = auth.uid()$$, 'admin no puede desactivarse');
rollback;
\echo TODAS_LAS_PRUEBAS_OK
