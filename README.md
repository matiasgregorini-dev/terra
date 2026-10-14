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

## Despliegue en Vercel

Importá el repositorio en Vercel; detecta Next.js automáticamente y no requiere variables
de entorno.
