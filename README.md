# Terra Consultora — sitio institucional

Sitio web de **Terra Consultora** (asesoramiento agropecuario profesional), hecho con
Next.js 16 (App Router), TypeScript y Tailwind CSS v4. Listo para desplegar en Vercel.

## Desarrollo

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # build de producción
npm run lint
```

## Dónde se editan los contenidos

Todos los textos y datos están en **`lib/site.ts`**. Se transcribieron de la
*Carpeta de Presentación* de Terra Consultora (PDF de 2015): misión, visión, servicios,
detalle de cada servicio, formación, experiencia y datos de contacto. Solo se corrigieron
errores ortográficos y de tipeo evidentes, y se quitó un ítem repetido.

## Identidad visual

- **Logo** (`public/logo.svg`) y **lema** "Potenciamos sus ideas" (`public/lema.svg`):
  extraídos en vectores del PDF original, sin pérdida de calidad. `public/logo.png` es
  una versión rasterizada para usos externos.
- **Paleta** (valores exactos del PDF): verde `#38633B`, oliva `#C4BF66`, gris oliva
  `#96946B`, piedra `#969480`, grafito `#707061`, salvia `#7A8A6B`.
- **Tipografías:** Quicksand (títulos, redondeada como la carpeta) e Inter (texto).
- **Motivos:** franjas verticales de la tapa y pestañas de color en los títulos, como
  en las páginas interiores.

## Pendientes (TODO) antes de publicar

| Qué | Dónde |
| --- | --- |
| Confirmar que la experiencia marcada "Desde…" siga vigente y sumar lo posterior a 2015 | `lib/site.ts` → `profesional.trayectoria` |
| Confirmar que el celular (02392) 15-546068 siga vigente y tenga WhatsApp | `lib/site.ts` → `contact` |
| Foto de campo propia o con licencia (JPG, 1920×1080 o mayor) para la banda "Visión" | `public/hero.jpg` (hoy hay un fondo provisorio, tapado por una capa verde) |
| Dominio: cargar `www.terraconsultora.com.ar` solo si sigue siendo tuyo | `lib/site.ts` → `url` |

## SEO y accesibilidad incluidos

- `lang="es-AR"`, title, description, canonical, Open Graph (`og:locale` `es_AR`) y Twitter Card.
- `robots.txt` y `sitemap.xml` generados por Next.js.
- Favicon SVG y apple-touch-icon con el isotipo; imagen para redes `public/og.png` (1200×630).
- Contraste WCAG AA en todos los textos: verde sobre blanco 7,0:1; tinta sobre oliva 7,2:1;
  oliva sobre verde oscuro 4,9:1; grafito sobre blanco 5,0:1. El gris oliva, la piedra y la
  salvia se usan solo como elementos decorativos.
- `alt` en todas las imágenes, enlace "Saltar al contenido", foco visible y respeto de
  `prefers-reduced-motion`.

## Portal de clientes (`/portal`)

Área privada donde distintos actores consultan y cargan información de cada
establecimiento. Se entra desde **"Acceso clientes"** en el encabezado del sitio.
Usa **Supabase** (base Postgres, autenticación y almacenamiento de archivos).

### Roles

| Rol | Ve | Puede cargar / administrar |
| --- | --- | --- |
| **Administrador** (Terra) | Todo | Usuarios, roles y accesos; establecimientos; lotes, documentos y novedades (incluidas novedades generales) |
| **Técnico / asesor de campo** | Sus establecimientos asignados | Lotes, documentos y novedades en esos establecimientos; borra solo lo que subió |
| **Productor / cliente** | Sus establecimientos: lotes, todos los documentos y novedades | — |
| **Personal del establecimiento** | Sus establecimientos y lotes; solo documentos y novedades marcados "visible para el personal" | — |

- **Sin registro público:** las cuentas se crean solo por invitación del administrador.
  La persona recibe un email, define su contraseña y entra con email + contraseña.
- **Seguridad en la base (Row Level Security):** los permisos de la tabla anterior
  los aplica Postgres en cada consulta, no la interfaz; aunque alguien arme una
  petición a mano, solo obtiene lo que su rol permite. Las acciones del servidor
  además verifican sesión y rol.
- **Archivos privados:** los documentos (PDF, imágenes, Excel, Word, CSV, ZIP,
  KMZ/KML; hasta 25 MB) se guardan en un bucket privado y se descargan con un
  enlace firmado que vence a los 60 segundos.
- **Desactivar una cuenta** corta el acceso a los datos y bloquea el ingreso, sin
  borrar el historial. Se puede reactivar.

### Puesta en marcha (una sola vez)

1. **Crear el proyecto** en [supabase.com](https://supabase.com) (plan gratuito;
   región sugerida: São Paulo, `sa-east-1`, la más cercana a Argentina).
2. **Crear las tablas y permisos:** en *SQL Editor*, pegar y ejecutar completo
   `supabase/migrations/20261014000000_portal.sql`.
3. **Autenticación** (*Authentication → Sign In / Providers*):
   - Desactivar **"Allow new users to sign up"** (registro público cerrado).
   - Dejar **activado el proveedor Email**. Ojo: si se desactiva, también deja de
     funcionar el ingreso con contraseña (comprobado en las pruebas).
   - En la configuración del proveedor Email, longitud mínima de contraseña: **8**
     (el portal también lo exige).
4. **URLs** (*Authentication → URL Configuration*): *Site URL* = dominio del
   sitio (p. ej. `https://www.terraconsultora.com.ar` o la URL de Vercel), y en
   *Redirect URLs* agregar `https://<dominio>/**`.
5. **Emails** (*Authentication → Emails*): reemplazar las plantillas
   **Invite user** y **Reset password** por `supabase/plantillas-email/invitacion.html`
   y `recuperacion.html` (el asunto sugerido está en la primera línea de cada
   archivo). Son necesarias: los enlaces apuntan a `/auth/confirmar`, que crea la
   sesión del lado del servidor.
6. **Envío de emails (SMTP):** el servidor de emails que trae Supabase tiene un
   límite muy bajo de envíos por hora y está pensado solo para pruebas. Para
   producción, configurar un SMTP propio en *Authentication → Emails → SMTP
   Settings* (p. ej. Resend, Brevo o el correo del dominio).
7. **Variables en Vercel** (*Settings → Environment Variables*), según
   `.env.example`: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
   y `SUPABASE_SECRET_KEY` (esta última, secreta). Volver a desplegar.
8. **Primer administrador:** en *Authentication → Users → Invite user*, invitar
   tu email. Aceptar la invitación, definir la contraseña y, en *SQL Editor*:

   ```sql
   update public.perfiles set rol = 'admin' where email = 'tu-email@ejemplo.com';
   ```

   Desde ahí, el resto de los usuarios se invitan desde el portal
   (*Usuarios → Invitar usuario*).

Mientras falten las variables, el sitio institucional funciona igual y la
pantalla de ingreso avisa que el portal no está conectado.

### Desarrollo local con Supabase

```bash
npx supabase start          # requiere Docker; aplica la migración y usa supabase/config.toml
cp .env.example .env.local  # completar con la URL y claves que imprime el comando anterior
npm run dev
```

Los emails de invitación y recuperación se ven en Mailpit (`http://127.0.0.1:54324`).

### Pruebas

- **Permisos por rol:** `./scripts/probar-permisos.sh` corre 32 verificaciones
  de RLS en un Postgres descartable (ver `supabase/tests/README.md`; `initdb` no
  corre como root).
- **De punta a punta:** el portal se probó con Supabase local y un navegador
  automatizado recorriendo los cuatro roles: invitación por email, activación,
  carga de lotes, documentos y novedades, visibilidad por rol, intentos de acceso
  a datos ajenos, desactivación de cuentas y recuperación de contraseña (46 pasos).

### Dónde está el código

| Qué | Dónde |
| --- | --- |
| Esquema, roles y permisos | `supabase/migrations/20261014000000_portal.sql` |
| Sesión, rol y redirecciones | `proxy.ts`, `lib/portal/auth.ts` |
| Clientes de Supabase | `lib/supabase/` |
| Lecturas / acciones (altas y bajas) | `lib/portal/datos.ts`, `lib/portal/acciones/` |
| Páginas | `app/ingresar`, `app/recuperar`, `app/auth`, `app/portal` |

## Despliegue en Vercel

Importá el repositorio en Vercel; detecta Next.js automáticamente. El sitio
institucional no requiere variables de entorno; el portal necesita las de
Supabase (ver "Puesta en marcha").
