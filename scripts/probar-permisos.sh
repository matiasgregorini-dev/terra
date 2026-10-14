#!/usr/bin/env bash
# Corre las pruebas de permisos (RLS) del portal contra un Postgres local
# descartable. Requiere PostgreSQL 15+ (initdb, pg_ctl y psql en el PATH o en
# /usr/lib/postgresql/<versión>/bin). No toca el proyecto real de Supabase.
set -euo pipefail

raiz="$(cd "$(dirname "$0")/.." && pwd)"
bin="$(ls -d /usr/lib/postgresql/*/bin 2>/dev/null | sort -V | tail -1 || true)"
export PATH="${bin:+$bin:}$PATH"

dir="$(mktemp -d)"
trap 'pg_ctl -D "$dir/data" -m immediate stop >/dev/null 2>&1 || true; rm -rf "$dir"' EXIT

initdb -D "$dir/data" -A trust -U postgres >/dev/null
pg_ctl -D "$dir/data" -o "-k $dir -p 54329 -c listen_addresses=" -l "$dir/log" -w start >/dev/null

psql_t() { psql -h "$dir" -p 54329 -U postgres -v ON_ERROR_STOP=1 -q -X "$@"; }
psql_t -d postgres -c "create database prueba"
psql_t -d prueba -f "$raiz/supabase/tests/00_stub_supabase.sql"
psql_t -d prueba -f "$raiz/supabase/migrations/20261014000000_portal.sql"
psql_t -d prueba -t -f "$raiz/supabase/tests/01_permisos.sql" 2>&1 \
  | sed -E 's/^psql:[^:]*:[0-9]+: //' | grep -E 'ok:|FALLA|ERROR|TODAS' 
