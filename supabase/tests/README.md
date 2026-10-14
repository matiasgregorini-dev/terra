# Pruebas de permisos (RLS)

`01_permisos.sql` verifica, rol por rol, qué puede ver y modificar cada usuario
según `supabase/migrations/*_portal.sql` (32 reglas: anónimo, personal,
productor, técnico, cuenta desactivada y administrador).

Se corren contra un Postgres local descartable, sin tocar el proyecto real:

```bash
./scripts/probar-permisos.sh   # requiere PostgreSQL 15+ instalado
```

`00_stub_supabase.sql` es una réplica mínima de los esquemas `auth` y `storage`
de Supabase, **solo** para estas pruebas. No ejecutarlo en Supabase.
