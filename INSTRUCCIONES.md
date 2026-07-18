# Cómo funciona tu sitio ahora (y qué tenés que hacer)

<<<<<<< HEAD
## 🆕 Novedades de esta versión

### Badge "Precio verificado"
Cada producto que tenga algo cargado en la columna `fecha_actualizacion` ahora
muestra un sello verde tipo "✓ Precio verificado · julio 2026" en su tarjeta,
en la home y en la ficha. Se arma solo con lo que pongas en esa columna — así
que conviene que la actualices cada vez que revises un precio (podés escribir
la fecha, el mes, o literalmente "hoy" si actualizás seguido). Si dejás esa
celda vacía, el badge no aparece — mejor eso a mostrar una fecha que no es real.

### SEO
- **Título y descripción por producto:** antes, todas las fichas (`producto.html?id=...`)
  compartían el mismo título para Google. Ahora cada una actualiza su propio
  `<title>`, descripción, URL canónica y las etiquetas Open Graph apenas carga
  el producto.
- **Datos estructurados (JSON-LD):** cada ficha le dice a Google explícitamente
  que es un producto, con precio y una reseña con tu calificación. Esto es lo
  que puede hacer que aparezcan estrellitas o precio en los resultados de búsqueda
  (Google decide si las muestra, no hay garantía, pero ayuda).
- **`sitemap.xml` y `robots.txt`:** nuevos, en la carpeta principal del sitio.
  Le indican a Google qué páginas rastrear. Las fichas de producto individuales
  no están listadas ahí (nacen de la planilla, no existen como archivos), pero
  Google las va a encontrar solas siguiendo los links desde `productos.html`.
- **✅ Dominio ya configurado:** todas las URLs de SEO (`index.html`, `productos.html`,
  `producto.html`, `aviso-legal.html`, `sitemap.xml` y `robots.txt`) ya apuntan a
  `https://compra-lab.vercel.app`, que es donde está publicado el sitio. Si en el
  futuro comprás un dominio propio (ej. `tumarca.com.ar`) y migrás el sitio ahí,
  vas a tener que volver a hacer buscar-y-reemplazar, esta vez cambiando
  `compra-lab.vercel.app` por tu dominio nuevo en esos mismos 6 archivos.

### Usabilidad en el catálogo (`productos.html`)
- **Ordenar por:** menor precio, mayor precio o mejor valorados.
- **Filtro por rango de precio:** dos campos "Mín" y "Máx" que se combinan con
  categoría y búsqueda. Nota: si un producto tiene un precio no numérico (ej.
  "Consultar"), no puede ubicarse en un rango y no va a aparecer si filtrás por precio.
- **"Cargar más":** el catálogo ya no muestra todos los productos de una — arranca
  con 9 y el botón revela de a 9 más. Da una carga inicial más liviana.
- **Skeleton de carga:** mientras se descarga la planilla, ahora se ven placeholders
  grises animados en vez de un texto de "Cargando…" o una pantalla en blanco.

### Rendimiento
- **Logo comprimido:** pesaba 744 KB (1254×1254px) para mostrarse a 42px de alto.
  Lo redimensioné y comprimí a **32 KB** (–96%), mismo aspecto visual.
- **Caché de la planilla:** el sitio ahora guarda los productos descargados en el
  navegador del visitante por 10 minutos. Navegar de Inicio → Categorías → una
  Ficha ya no vuelve a pedirle el CSV a Google Sheets en cada click, solo la
  primera vez. Pasados los 10 minutos, se vuelve a pedir para traer cambios frescos.
- **Menos "salto" de contenido:** la imagen principal de cada ficha ahora reserva
  su espacio antes de cargar, para que el resto del texto no se mueva de golpe.

---

=======
>>>>>>> b927470f233d104a89b23c4b8e0c926f01c9dc22
Tu sitio ya **NO** necesita que cargues cada producto a mano en el código.
Ahora los productos viven en una **planilla de Google Sheets**, y el sitio los
lee solo. Agregás una fila = aparece un producto nuevo, con su propia página
(`producto.html?id=...`) y su tarjeta en el catálogo (`productos.html`).

Esto son 3 pasos únicos (los hacés una sola vez) y después el mantenimiento
del día a día es solo "agregar una fila".

---

## PASO 1 — Crear la planilla de Google Sheets

1. Andá a [sheets.google.com](https://sheets.google.com) y creá una planilla nueva.
2. En la primera fila (fila 1), pegá exactamente estos encabezados, uno por columna:

```
id	nombre	categoria	imagen	precio_actual	precio_anterior	rating	tag	resumen	analisis	rendimiento	specs	pros	contras	faq	link_afiliado	tienda	destacado	fecha_actualizacion
```

3. Para no arrancar de cero, importá el archivo `productos-ejemplo.csv` que te dejo
   en este mismo zip: en Sheets, `Archivo > Importar > Subir` y elegís ese archivo.
   Vas a ver 3 productos de ejemplo ya cargados, uno por categoría. Editalos o
   borralos y empezá a poner los tuyos reemplazando esas filas.

### Qué va en cada columna

| Columna | Qué es | Ejemplo |
|---|---|---|
| `id` | Identificador único, sin espacios ni tildes (se usa en la URL) | `heladera-nofrost-350l` |
| `nombre` | Nombre del producto | `Heladera No Frost 350L` |
| `categoria` | Tiene que coincidir con: `Electrodomésticos`, `Tecnología` o `Gaming` (mayúsculas/tildes ya no importan, el sitio las normaliza solo) | `Electrodomésticos` |
| `imagen` | Link directo a una imagen (ver Paso 1b) | `https://...jpg` |
| `precio_actual` | Precio con formato libre | `$850.000` |
| `precio_anterior` | Opcional, para mostrar tachado | `$920.000` |
| `rating` | Número del 0 al 5 (podés usar 4.5) | `4.5` |
| `tag` | Etiqueta corta que aparece en la tarjeta | `Mejor relación precio-calidad` |
| `resumen` | 1-2 líneas para la tarjeta del catálogo | — |
| `analisis` | Texto largo, tu reseña principal | — |
| `rendimiento` | Texto sobre rendimiento/diseño (opcional) | — |
| `specs` | Pares `clave:valor` separados por `\|` | `Capacidad:350 L\|Garantía:12 meses` |
| `pros` | Ítems separados por `\|` | `Bajo consumo\|Silenciosa` |
| `contras` | Ítems separados por `\|` | `Freezer chico` |
| `faq` | Pares `pregunta::respuesta` separados por `\|` | `¿Vale la pena?::Sí, ...` |
| `link_afiliado` | Tu link de Mercado Libre o de Amazon con el tag de afiliado | — |
| `tienda` | Opcional. `Mercado Libre` o `Amazon`. Si lo dejás vacío, el sitio detecta la tienda solo mirando el `link_afiliado` | `Amazon` |
| `destacado` | `SI` en un solo producto (el que se muestra en la home) | `SI` |
| `fecha_actualizacion` | Texto libre | `julio 2026` |

**Importante:** en `specs`, `pros`, `contras` y `faq` usá el símbolo `|` para separar
elementos. No hace falta que sea perfecto: si te equivocás, simplemente ese campo
sale vacío en la página, nada se rompe.

### Paso 1b — Imágenes
La forma más simple: subí las fotos de los productos a una carpeta de Google
Drive o Imgur, y pegá el **link directo a la imagen** (que termine en .jpg o .png)
en la columna `imagen`. Si dejás esa celda vacía, se usa una imagen genérica.

### Paso 1c — Cómo funciona ahora la búsqueda y el filtro por categoría
En `productos.html` ahora hay dos formas de encontrar productos:

- **Filtro por categoría**: los botones de arriba, o entrando desde la home a
  través de un link tipo `productos.html?cat=Gaming`. Al tocar una categoría (o
  llegar desde ese link) solo se muestran los productos de esa categoría.
- **Buscador de texto**: el campo de búsqueda filtra por nombre, resumen o tag,
  y se puede combinar con el filtro de categoría (por ejemplo: categoría
  "Tecnología" + buscar "auriculares").

Ambos filtros ignoran mayúsculas y tildes, así que no importa si en la planilla
escribís "electrodomesticos" o "Electrodomésticos": el sitio los reconoce igual.

---

## PASO 2 — Publicar la planilla como CSV (esto es lo que conecta todo)

1. En Google Sheets: `Archivo > Compartir > Publicar en la Web`.
2. Donde dice "Vínculo", elegís la pestaña con tus productos (no "Todo el documento").
3. Donde dice tipo de archivo, cambiá `Página web` por **`Valores separados por comas (.csv)`**.
4. Click en **Publicar**, confirmás, y te va a dar un link parecido a:
   ```
   https://docs.google.com/spreadsheets/d/e/XXXXXXX/pub?output=csv
   ```
5. Copiá ese link completo.

## PASO 3 — Pegar el link en el sitio

1. Abrí el archivo `js/productos.js` (con cualquier editor de texto, hasta el
   Bloc de notas sirve).
2. Buscá esta línea, cerca del principio:
   ```js
   const SHEET_CSV_URL = "PEGA_AQUI_TU_LINK_CSV_DE_GOOGLE_SHEETS";
   ```
3. Reemplazá el texto entre comillas por el link que copiaste en el Paso 2. Queda así:
   ```js
   const SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/e/XXXXXXX/pub?output=csv";
   ```
4. Guardás el archivo.

**Listo.** De acá en adelante, para agregar un producto nuevo solo tenés que
agregar una fila en la planilla. No hace falta tocar código nunca más, ni volver
a pedirme que te genere páginas a mano.

---

# Ahora, ¿qué hay que pagar y cómo se publica el sitio?

Tu sitio hoy es una carpeta de archivos en tu computadora. Para que cualquiera
lo vea en internet, necesitás dos cosas separadas:

## 1. Hosting (dónde "vive" el sitio) — puede ser GRATIS

Para un sitio como el tuyo (HTML/CSS/JS, sin base de datos propia), te alcanza
con un plan gratuito. Los tres más usados:

- **Netlify** (recomendado, el más simple): entrás a [netlify.com](https://netlify.com),
  te registrás gratis, y **arrastrás la carpeta del sitio** a la web. Ya queda publicado
  en una dirección tipo `tumarca.netlify.app`. Sin tarjeta de crédito, sin límite de tiempo.
- **Vercel**: similar a Netlify, también gratis.
- **GitHub Pages**: gratis, pero requiere saber un poco de Git.

<<<<<<< HEAD
**Vos ya tenés esto resuelto: tu sitio está publicado en Vercel**, en
`https://compra-lab.vercel.app`. Para publicar una actualización nueva, es el
mismo mecanismo que ya usaste la primera vez (subir la carpeta actualizada a
tu proyecto de Vercel). No hace falta que cambies de plataforma ni que uses Netlify.
=======
**Mi recomendación: arrancá con Netlify.** Es gratis, no vence, y en 5 minutos
tenés el sitio online para probarlo con la familia/amigos antes de gastar en dominio.
>>>>>>> b927470f233d104a89b23c4b8e0c926f01c9dc22

## 2. Dominio (el nombre, ej. `tumarca.com.ar`) — esto SÍ se paga

Un dominio no es obligatorio para arrancar (podés usar el `.netlify.app` gratis
un tiempo), pero para verte profesional y que la gente confíe en tus links de
afiliado, conviene tener uno propio. Precios aproximados en Argentina:

| Dominio | Costo aproximado por año |
|---|---|
| `.com.ar` | USD 10-15 (vía NIC Argentina) |
| `.com` | USD 10-20 (vía Namecheap, GoDaddy, Google Domains) |

Una vez comprado, en 10 minutos lo conectás a Netlify/Vercel desde su panel
(te piden apuntar unos "registros DNS", ellos mismos te dan el instructivo
exacto según dónde compraste el dominio).

## 3. Lo que NO tenés que pagar

- **Google Sheets**: gratis.
- **El motor que armé** (JS que lee la planilla): gratis, ya está en tu sitio.
- **Programas de afiliados** (Mercado Libre Afiliados, Amazon Asociados, etc.):
  son gratis de sumarte. Son ellos los que **te pagan a vos** una comisión, no al revés.
  Si alguna vez te piden pagar para ser afiliado de algo, desconfiá — no es como
  funcionan los programas legítimos.

## Resumen de costos reales

| Ítem | Costo |
|---|---|
| Hosting (Netlify) | $0 |
| Planilla de Google Sheets | $0 |
| Programas de afiliados | $0 (te pagan a vos) |
| Dominio propio (opcional pero recomendado) | ~USD 10-20/año |

**Total para arrancar en serio: el precio de un dominio, una vez al año.** Todo
lo demás corre gratis con el plan que armamos.

---

# Cómo afiliarte a Amazon (Amazon Asociados)

El sitio ya está preparado para vender con links de Amazon, además de Mercado
Libre: el botón de cada ficha de producto muestra automáticamente "Ver precio
en Amazon" o "Ver precio en Mercado Libre" según el link que pongas en la
columna `link_afiliado` (o lo que escribas en `tienda`).

Para poder usar links de afiliado reales de Amazon, primero tenés que
registrarte y ser aceptado en su programa. Así es el proceso:

1. **Registrate en el programa.** Andá a [afiliados.amazon.com](https://afiliados.amazon.com)
   (o `associates.amazon.com` si tu público es de EE.UU./otro país) y creá una
   cuenta de Amazon Asociados.
2. **Aprobación.** Al registrarte tenés que indicar la información de tu sitio
   o tus plataformas (en tu caso, la URL de Tu Marca una vez publicada, y tus
   redes si las usás para promocionar productos). Amazon revisa esa solicitud
   antes de aceptarte oficialmente en el programa — no es automático, así que
   puede tardar unos días. Mientras esperás la aprobación, no vas a tener links
   de afiliado propios de Amazon: podés dejar esos productos solo con link de
   Mercado Libre hasta que te acepten.
3. **Generá tus links.** Una vez aprobado, desde el panel de Amazon Asociados
   buscás cada producto y generás tu link con tu ID de afiliado. Ese es el link
   que pegás en la columna `link_afiliado` de la planilla.
4. **Transparencia obligatoria.** Amazon exige que indiques en tu sitio que
   participás en su programa de afiliados y que podés recibir una comisión por
   las compras que se hagan a través de tus enlaces. Esto **ya está resuelto**
   en el sitio: agregamos el aviso correspondiente en el pie de página de todas
   las páginas y en una sección dedicada dentro de `aviso-legal.html`. No hace
   falta que hagas nada extra en este punto, pero sí revisá que ese archivo
   quede publicado junto con el resto del sitio.

**Importante:** hasta que Amazon apruebe tu cuenta, no deberías publicar links
"de prueba" a productos de Amazon sin tu tag de afiliado real, porque no vas a
cobrar comisión por esas ventas. Usá Mercado Libre mientras tanto, y sumás
Amazon en cuanto te aprueben.
