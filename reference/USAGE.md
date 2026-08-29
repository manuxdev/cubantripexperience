# Cómo usar esta referencia en un ciclo SDD

Contrato de migración WordPress → Astro. Esta carpeta **no es documentación de apoyo: es el criterio de aceptación**. Si el spec dice `#F8F43D85`, el resultado tiene ese color con ese alpha.

## 1. Qué es cada cosa

```
reference/
├── USAGE.md              ← este archivo
├── es/
│   ├── README.md         ← sistema de diseño global (paleta, tipografía, breakpoints)
│   └── <slug>/
│       ├── spec.md       ← CONTRATO de la página
│       ├── elementor.json← fuente cruda, si el spec omite algo
│       ├── desktop.png   ← 1440px, full page
│       ├── tablet.png    ← 768px
│       ├── mobile.png    ← 390px
│       └── rendered.html ← HTML final del WordPress (desktop)
└── tools/                ← scripts para regenerar y para comparar
```

`spec.md` **no** es HTML raspado. Sale de `_elementor_data`, la estructura que Elementor guarda en la base de datos: la maqueta real, con los valores exactos que el autor escribió.

## 2. Cómo leer un `spec.md`

```markdown
### Section 3

- **section**
  - _style_: background_color=#EFF1F2; custom_height=317px; padding=30px 0px 50px 0px
  - **column [33%]**
    - _style_: margin=50px 0px 0px 0px; margin_mobile=20px 0px 0px 0px
    - **widget:heading**
      - `title`: Envianos un mensaje
      - _style_: title_color=#000000; typography_font_size=20px; typography_font_weight=600
```

| Elemento | Significado |
|---|---|
| `### Section N` | Sección de nivel raíz, en orden de aparición vertical |
| `**section**` / `**column [33%]**` / `**widget:tipo**` | Jerarquía de Elementor. El `%` de la columna es su ancho en desktop |
| `` `title` ``, `` `editor` ``, `` `text` `` | **Copy literal.** Copiar tal cual, tildes incluidas — el origen tiene erratas (`Envianos`) y se respetan |
| `_style_` | Valores de diseño. Formato `padding=top right bottom left` |
| Sufijo `_tablet` / `_mobile` | Override para ese breakpoint. Sin sufijo = desktop |
| `(N items)` | Repetidor (carrusel, lista de iconos, tabs). Cada ítem numerado |

**Los hex llevan alpha en el 8º dígito.** `#F8F43D85` = `rgba(248,244,61,0.52)`. `#3F3F3FCF` = 81% opaco. No truncarlos a 6 dígitos.

Si algo no aparece en `spec.md` (el generador filtra ruido de Elementor), está en `elementor.json`.

## 3. Breakpoints: la trampa

Elementor y Tailwind **no coinciden**:

| | Elementor | Tailwind por defecto |
|---|---|---|
| Mobile | `< 768px` | `< 640px` (`sm`) |
| Tablet | `768–1024px` | `md: 768px` |
| Desktop | `≥ 1025px` | `lg: 1024px` |

En 1024px Elementor todavía es tablet y Tailwind `lg` ya disparó. Para paridad, definir en `tailwind.config.cjs`:

```js
screens: {
  mobile: { max: '767px' },   // -> _mobile
  tablet: { max: '1024px' },  // -> _tablet
}
```

Y traducir `margin_mobile` → `mobile:m-*`, `margin_tablet` → `tablet:m-*`.

## 4. Encaje en el ciclo SDD

**Un work unit = una página.** El `spec.md` es el contrato del work unit; no hace falta redactar requisitos a mano.

Orden sugerido por dependencia:

| # | Work unit | Por qué en ese orden |
|---|---|---|
| 1 | Header + nav flotante + footer | Aparecen en las 11 páginas. Hasta que no estén, ninguna página cierra visualmente |
| 2 | Tokens en `tailwind.config.cjs` | Paleta, Poppins y los `screens` de arriba |
| 3 | `contactos`, `reservar` | Las más cortas (99 y 135 líneas de spec). Validan header/footer/tokens con poco riesgo |
| 4 | `servicios` | Página única, complejidad media |
| 5 | `la-habana` → luego las otras 5 destinos | Comparten plantilla: `spec.md` casi idéntico (170–173 líneas). Una vez hecha la primera, las otras 5 son datos |
| 6 | `destinos`, `inicio` | Las más largas (317 y 279). Reutilizan las tarjetas de destino de #5 |

Para cada work unit, el prompt al ejecutor:

> Implementá `reference/es/<slug>/spec.md` como `src/pages/<ruta>.astro`.
> Copy literal del spec, sin reescribir. Colores con alpha exacto.
> Overrides `_tablet`/`_mobile` → variantes `tablet:`/`mobile:` de Tailwind.
> Criterio de aceptación: paridad visual con `reference/es/<slug>/desktop.png`,
> `tablet.png` y `mobile.png` en los tres breakpoints.

## 5. Verificación

**No aceptes "el DOM coincide". Se mide.** Con el dev server de Astro corriendo:

```sh
./reference/tools/compare.sh contactos /es/contactos
```

Captura la página desde Astro en los tres anchos, la compara píxel a píxel contra la referencia y devuelve un veredicto con código de salida — sirve como compuerta en cualquier script:

```
desktop  FAIL  height 1055->1273 (20.7%)  pixels 32.3% of 1440x1055
tablet   FAIL  height 1172->1273 (8.6%)   pixels 34.0% of 768x1172
mobile   FAIL  height 1278->2010 (57.3%)  pixels 27.0% of 390x1278

VERDICT: FAIL
```

Dos números por breakpoint, porque atrapan fallas distintas:

| Métrica | Qué detecta |
|---|---|
| `height` | Layout que crece o colapsa. Es la falla que shipeó `/contact-us` a 1273px contra 1055px del origen |
| `pixels` | Colores, tipografía, espaciado e imágenes mal en la región común, aun con altura idéntica |

Además escribe `diff-{desktop,tablet,mobile}.png`, con cada píxel distinto marcado. Abrilo: te dice *dónde* está el problema, no sólo que existe.

Tolerancias por defecto 2% en ambas. Se ajustan por corrida:

```sh
HEIGHT_TOLERANCE=0.01 PIXEL_TOLERANCE=0.05 ./reference/tools/compare.sh inicio /es/
ORIGIN=http://localhost:4321 ./reference/tools/compare.sh servicios /es/servicios
```

Un detalle sobre `pixels`: se mide sobre la región común superior de ambas capturas. Si las alturas difieren mucho, ese porcentaje mira sólo la parte compartida — por eso `height` va primero. Con altura correcta y `pixels` bajo, la página está.

La primera línea siempre imprime las tolerancias en uso, y las marca si no son las de por defecto:

```
tolerance height 30.0% pixels 50.0%   <-- RAISED ABOVE DEFAULT, must be justified by a named non-goal
```

Está puesto a propósito: subir la tolerancia para que algo pase deja rastro en la misma evidencia que se pega en el registro del work unit. Si no hay un no-objetivo que justifique la región distinta, la corrida no vale.

### Antes de medir una página NUEVA: reiniciá el dev server

Un dev server de Astro de larga vida puede quedarse con una caché JIT de Tailwind vieja y **nunca compilar las clases de un archivo de página recién creado**. La página sale sin estilos y `compare.sh` reporta una diferencia de altura absurda (se vio un 125%) que parece un defecto de código y no lo es.

```sh
# tras crear src/pages/es/<nueva>.astro
pkill -f "astro dev"; npm run dev &   # esperá a que levante antes de comparar
```

Si el primer `compare.sh` de una página nueva da un número disparatado, esto es lo primero a descartar — antes de tocar una línea de CSS.

### Encontrar dónde empieza la diferencia

`compare.sh` te dice *cuánto* difiere. `drift.mjs` te dice *dónde* y *por qué*:

```sh
cd reference/tools && node drift.mjs http://localhost:8080/contactos/ http://localhost:3000/es/contactos 390
```

Cruza los textos visibles de ambas páginas y compara la posición vertical de cada uno, con su tamaño y line-height computados:

```
  delta   wp_top  as_top  wp(size/lh)        as(size/lh)      text
*    35     262     297  20px/25px          20px/25px        Estamos aquí para ayudarte
*    72     424     496  14.592px/23.3472px 16px/25.6px      Correo electrónico: support@...
*   230    1161    1391  12px/12px          12px/12px        © 2023 CubanTripExperience...
```

Se lee de arriba hacia abajo: **la primera fila con delta no trivial es donde se introduce la diferencia**; todo lo de abajo la hereda. Si el delta crece monótonamente, es una sola causa acumulándose, no muchos errores. Arreglá la primera fila y las de abajo suelen colapsar solas.

La columna `size/lh` es la que da el porqué. En el ejemplo, el origen renderiza el cuerpo a `14.592px` en mobile y el target a `16px`: el texto envuelve en más líneas y la página entera crece.

Requiere el WordPress levantado (`docker compose up -d` una carpeta más atrás).

### No romper el inglés

Las páginas inglesas no tienen referencia de WordPress propia, así que la no-regresión se prueba contra **sí mismas**, antes y después de tocar código compartido (tokens, `Layout`, header, footer):

```sh
./reference/tools/baseline.sh contact-us /contact-us   # ANTES: graba la línea base
# ...aplicás el cambio compartido...
./reference/tools/baseline.sh contact-us /contact-us   # DESPUÉS: captura y compara
```

El orden importa y el script no puede vigilarlo: una línea base grabada **después** del cambio no prueba nada. Se graba primero. Para descartar una línea base vieja: `./reference/tools/baseline.sh --reset contact-us`.

## 6. Regenerar la referencia

Con el stack de WordPress arriba (`docker compose up -d` una carpeta más atrás):

```sh
./reference/tools/extract.sh              # las 11 páginas: JSON + spec + capturas
./reference/tools/extract.sh inicio       # una sola
SKIP_SHOTS=1 ./reference/tools/extract.sh # sin navegador, sólo JSON + spec
```

`reference/tools/pages.tsv` es el mapa slug → post_id → ruta. Para sumar el inglés o el ruso, agregar filas ahí y cambiar `es` por el idioma en `extract.sh`.

IDs de las otras lenguas:

```sh
docker exec cubantripexperience-db-1 sh -c 'mariadb -uroot -p"$MARIADB_ROOT_PASSWORD" -N -B \
  -e "SELECT p.ID, p.post_name, t.slug FROM wp_posts p
      JOIN wp_term_relationships tr ON tr.object_id=p.ID
      JOIN wp_term_taxonomy tt ON tt.term_taxonomy_id=tr.term_taxonomy_id AND tt.taxonomy=\"language\"
      JOIN wp_terms t ON t.term_id=tt.term_id
      WHERE p.post_type=\"page\" AND p.post_status=\"publish\" ORDER BY t.slug;" wordpress'
```

## 7. Imágenes del origen

`reference/es/_media/` tiene las **52 imágenes** que citan los `spec.md`, con su nombre original de WordPress — el mismo que aparece en `background_image=` y en los repetidores. Sin adivinar qué imagen usa cada sección.

```sh
./reference/tools/fetch-media.sh   # re-descarga lo que falte
```

Ocho URLs `.jpg` del spec dan 404 en el propio WordPress: Autoptimize las convirtió a `.webp` y borró el original. Cada una tiene su gemela en minúsculas ya descargada:

| URL del spec (404) | Archivo real |
|---|---|
| `El-Capitolio-Havana-Cuba.jpg` | `el-capitolio-havana-cuba.webp` |
| `El-Nicho-Cienfuegos-Cuba.jpg` | `el-nicho-cienfuegos-cuba.webp` |
| `Cienfuegos-Cuba.jpg` | `cienfuegos-cuba.webp` |
| `Malecon-de-Cienfuegos_-Cuba.jpg` | `malec195179n-de-cienfuegos-cuba.webp` |
| `Cuba-mia-La-Floridita-Havana-vieja.jpg` | `cuba-mia-la-floridita-havana-vieja.webp` |
| `The-Necropolis-Cristobal-Colon-Cemetery-Habana.jpg` | `lis-cristobal-colon-cemetery-habana.webp` |
| `Photographic-Print_-Castillo-Del-Morro-…-24x16in-e1689383013284.jpg` | `Photographic-Print_…-e1689383013284.webp` |
| `Cubanos-por-el-Mundo-…-El-Malecon-de….jpg` | `226128156el-malec195179n-de226128166.webp` |

Los nombres con `195179`, `226128156` y similares son mojibake de UTF-8 del WordPress origen (`Malecón` → `malec195179n`). Se respetan tal cual al buscarlos; al copiarlos a `src/assets/` conviene renombrarlos semánticamente, como ya se hizo con los assets ingleses (`el-capitolio-havana-cuba.webp` → `src/assets/pages/havana/the-capitol.webp`).

`_media/` está en `.gitignore`: pesa ~7 MB y se regenera con el script, o desde `wordpress/wp-content/uploads/`.

## 8. La fuente del WordPress local

El WordPress traía `wp-content/uploads/elementor/google-fonts/css/poppins.css` apuntando a `https://cubantripexperience.com/`, un dominio que **no resuelve**. Los 54 woff2 sí estaban en disco, pero el CSS no los alcanzaba, así que el origen renderizaba con fuente de reemplazo y **las capturas de referencia salían mal**.

Se reescribieron esas 54 URLs a `http://localhost:8080/`. El original quedó en `poppins.css.orig-backup`.

Si alguna vez el origen vuelve a renderizar sin Poppins, verificalo así:

```sh
rg -c 'cubantripexperience\.com' \
  ../wordpress/wp-content/uploads/elementor/google-fonts/css/poppins.css   # debe dar 0
curl -s -o /dev/null -w '%{http_code}\n' \
  http://localhost:8080/wp-content/uploads/elementor/google-fonts/css/poppins.css
```

Es el único archivo del WordPress que se modificó. Todo lo demás del origen se trata como sólo-lectura.

### Animaciones de entrada de Elementor

Elementor marca las secciones con animación de entrada (`animation=fadeInRight` y similares) con la clase `.elementor-invisible`, y sólo las revela cuando su observador dispara al hacer scroll. Una captura de página completa re-scrollea por su cuenta, así que esas secciones salían **invisibles**: la home española perdía entera la sección de la van amarilla («Cualquier tamaño de grupo, cualquier distancia»), dejando una banda blanca de 465px donde hay contenido real.

`shot.mjs` ahora inyecta, antes de capturar:

```css
.elementor-invisible { visibility: visible !important; opacity: 1 !important; animation: none !important; }
*, *::before, *::after { animation-duration: 0s !important; transition-duration: 0s !important; }
```

Captura el **estado asentado**, que es lo que hay que replicar. También hace determinista el carrusel: ya no se captura a mitad de transición.

Si ves una banda vacía sospechosa en una referencia, comprobalo así:

```sh
rg -c "Cualquier tamaño de grupo" reference/es/inicio/spec.md   # el contenido está en los datos
```

Si el spec tiene contenido que la captura no muestra, la captura está mal, no el origen.

**La lección general**: una referencia capturada en un entorno degradado no es una referencia. Antes de perseguir una diferencia como si fuera un defecto de código, confirmá que el origen se está renderizando completo — `drift.mjs` lo delata enseguida, porque la columna `size/lh` del lado WordPress muestra métricas que no coinciden con las que autoró el spec.

## 9. Límites conocidos

- **Fuera de alcance por decisión previa:** widgets de reseñas de TripAdvisor/Trustpilot, y el envío real de formularios. Los `fluent-form-widget` se migran **sólo visualmente** (sin action, sin endpoint).
- **`polylang-language-switcher`**: sólo se migra el español. El selector queda para cuando se sumen los otros idiomas.
- Las capturas y `rendered.html` están en `.gitignore` (~26 MB, regenerables). `spec.md` y `elementor.json` **sí** se versionan: son el contrato.
- `spec.py` filtra settings de Elementor por nombre. Si una página usa un widget raro y falta algo, está en `elementor.json`.
