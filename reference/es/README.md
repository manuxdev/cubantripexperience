# Referencia visual — Cuban Trip Experience (ES)

Extracción fiel del WordPress origen (`http://localhost:8080`) para replicar en Astro.

> **Para implementar con SDD, empezá por [`../USAGE.md`](../USAGE.md)** — cómo leer un `spec.md`, el orden de work units y cómo verificar paridad visual.

## Qué hay en cada carpeta

| Archivo | Qué es |
|---|---|
| `spec.md` | Árbol completo de la página: secciones → columnas → widgets, con copy exacto, colores, tipografías, spacing y overrides responsive. **Generado desde `_elementor_data`, no desde HTML raspado.** |
| `elementor.json` | JSON crudo de Elementor. La fuente de verdad si `spec.md` omite algo. |
| `desktop.png` / `tablet.png` / `mobile.png` | Captura full-page a 1440 / 768 / 390 px. |
| `rendered.html` | HTML final renderizado (desktop), con clases Astra/Elementor resueltas. |

## Páginas

| Slug | Origen | Ruta Astro |
|---|---|---|
| `inicio` | `/es/` | `/es/` |
| `servicios` | `/servicios/` | `/es/servicios` |
| `destinos` | `/destinos/` | `/es/destinos` |
| `la-habana` | `/la-habana/` | `/es/destinos/la-habana` |
| `trinidad` | `/trinidad-es/` | `/es/destinos/trinidad` |
| `cienfuegos` | `/cienfuegos-es/` | `/es/destinos/cienfuegos` |
| `matanzas` | `/matanzas-es/` | `/es/destinos/matanzas` |
| `santiago-de-cuba` | `/santiago-cuba-es/` | `/es/destinos/santiago-de-cuba` |
| `pinar-del-rio` | `/pinar-del-rio-es/` | `/es/destinos/pinar-del-rio` |
| `contactos` | `/contactos/` | `/es/contactos` |
| `reservar` | `/reservar/` | `/es/reservar` |

Prefijo `/es/` conservando el slug del origen, según `openspec/changes/spanish-site-visual-parity/proposal.md`. El inglés queda en `/`, igual que en el WordPress.

## Sistema de diseño real

El kit global de Elementor está sin tocar (paleta por defecto `#6EC1E4`…). **Los colores reales van inline en cada widget.** Estos son los que de verdad usa el sitio:

### Paleta (por frecuencia de uso)

| Token | Hex | Uso |
|---|---|---|
| Amarillo marca | `#F8F43D` | Botones CTA, bordes de formulario |
| Amarillo marca (hover/link) | `#CFC725` | Links activos y hover del menú |
| Amarillo alt | `#E9D628` · `#F5E234` · `#DFCB13` | Acentos secundarios |
| Gris texto | `#5F5F5F` · `#5F5E5C` | Cuerpo |
| Gris oscuro | `#3E4243` · `#3A3838` · `#414141` · `#313131` | Títulos, footer |
| Gris claro | `#E0DEDE` · `#F2EDED` · `#F5F5F5` · `#EFF1F2` | Fondos de sección |
| Blanco / Negro | `#FFFFFF` · `#000000` | — |
| Marrón overlay | `#503607` | Tinte sobre imágenes hero (~50% alpha) |
| Barra nav | `#3F3F3FCF` → `#5F5F5F` | Gradiente translúcido del nav flotante |
| Azul borde | `#5DBBFE91` | Borde de tarjetas |

Muchos valores llevan **alpha en el 8º dígito** (`#F8F43D85` = 52%, `#3F3F3FCF` = 81%). Respetarlo.

### Tipografía

- **Única familia: Poppins.** Pesos usados: 600 (89 usos) · 500 (31) · 400 (25) · **700 (2)**.
  El 700 aparece sólo en el título `¿Por qué somos los mejores?` de la home (`inicio/spec.md:71`). Es raro, pero si no se carga, ese título renderiza con un peso sustituido y el diff lo marca.
- Escala real (por frecuencia): `17px` (cuerpo, dominante), `20px`, `12–13px`, `16px`, `24px`, `47px` (h1 desktop), `45px` (h1 tablet), `24px` (h1 mobile).

### Breakpoints Elementor

| Nombre | Rango | Sufijo en `spec.md` |
|---|---|---|
| Desktop | ≥ 1025px | (sin sufijo) |
| Tablet | 768–1024px | `_tablet` |
| Mobile | < 768px | `_mobile` |

Ojo: **no coinciden con los de Tailwind por defecto** (`md:768`, `lg:1024`). Para paridad exacta, mapear `_tablet` → `max-lg:` y `_mobile` → `max-md:`, o redefinir `screens` en `tailwind.config.cjs`.

### Widgets de terceros presentes

- `fluent-form-widget` — formularios (Contactos, Reservar). Solo visual en la migración.
- `polylang-language-switcher` — selector ES/EN/RU.
- `nav-menu`, `wp-widget-*`, sliders de TripAdvisor/Trustpilot — omitidos según decisión previa.

## Reproducir esta extracción

```sh
# JSON de Elementor de una página
docker exec cubantripexperience-db-1 sh -c \
  'mariadb -uroot -p"$MARIADB_ROOT_PASSWORD" -N -B --raw \
   -e "SELECT meta_value FROM wp_postmeta WHERE post_id=<ID> AND meta_key=\"_elementor_data\";" wordpress'
```

IDs: inicio 1732 · servicios 448 · destinos 1201 · la-habana 45 · trinidad 47 · cienfuegos 1671 · matanzas 43 · santiago 1688 · pinar-del-rio 2280 · contactos 57 · reservar 55.
