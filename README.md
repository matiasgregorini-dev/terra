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

Todos los datos institucionales están en **`lib/site.ts`**. Los campos vacíos no se
muestran en el sitio (no se cargó ningún dato inventado).

## Pendientes (TODO) antes de publicar

| Qué | Dónde | Efecto mientras falte |
| --- | --- | --- |
| Texto de presentación (formación, años de experiencia, zona, enfoque) | `lib/site.ts` → `consultant.bio` (un string por párrafo) | "Quiénes somos" muestra solo nombre y rol |
| Número de WhatsApp (solo dígitos, con código de país, ej. `5492392XXXXXX`) | `lib/site.ts` → `contact.whatsapp` | No se muestra el botón flotante ni el WhatsApp del pie |
| Zona de trabajo | `lib/site.ts` → `contact.area` | No se muestra en el pie |
| Dominio definitivo | `lib/site.ts` → `url` | Se usa la URL de producción de Vercel (`VERCEL_PROJECT_PRODUCTION_URL`) |
| Foto de campo del hero (JPG, 1920×1080 o mayor) | `public/hero.jpg` | Se ve una imagen placeholder rotulada |
| Logo (PNG cuadrado, fondo transparente) | `public/logo.png` | Se ve un logo placeholder |
| Favicon definitivo (opcional) | `app/icon.svg` y `app/apple-icon.png` | Se usa un ícono provisorio con la paleta |

Para reemplazar las imágenes, subí el archivo nuevo con **el mismo nombre** y volvé a desplegar.

## SEO y accesibilidad incluidos

- `lang="es-AR"`, title, description, canonical, Open Graph (`og:locale` `es_AR`) y Twitter Card.
- `robots.txt` y `sitemap.xml` generados por Next.js.
- Favicon SVG y apple-touch-icon.
- Contraste WCAG AA en todos los textos (verde `#2F5D3A` sobre crema: 6,8:1; el tono tierra
  `#8B6B4A` se usa solo en elementos decorativos, y para texto chico una variante más oscura
  `#6E5439`: 6,2:1). Capa oscura sobre la foto del hero para asegurar la legibilidad.
- `alt` en todas las imágenes, enlace "Saltar al contenido", foco visible y respeto de
  `prefers-reduced-motion`.

## Despliegue en Vercel

Importá el repositorio en Vercel; detecta Next.js automáticamente y no requiere variables
de entorno.
