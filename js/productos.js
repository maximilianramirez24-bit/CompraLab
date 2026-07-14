/* ==========================================================================
   PRODUCTOS.JS — Versión anti-caché fuerte
   ========================================================================== */

const SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQp1ff1tGlBIGBE2WZMEc4W2G4MEpwZIvuu2SM7cHVfhz_FwrUEcBwjgEHTX_i5TQ/pub?output=csv";

async function cargarProductos() {
    try {
        const timestamp = Date.now();
        const urlForzada = `${SHEET_CSV_URL}${SHEET_CSV_URL.includes('?') ? '&' : '?'}nocache=${timestamp}`;
        
        console.log("🔄 Cargando productos desde:", urlForzada);
        
        const respuesta = await fetch(urlForzada, {
            cache: 'no-store',
            headers: {
                'Pragma': 'no-cache',
                'Cache-Control': 'no-cache, no-store, must-revalidate'
            }
        });

        if (!respuesta.ok) throw new Error(`HTTP ${respuesta.status}`);

        const texto = await respuesta.text();
        console.log("📄 CSV recibido, tamaño:", texto.length, "caracteres");

        const resultado = Papa.parse(texto, { 
            header: true, 
            skipEmptyLines: true,
            transformHeader: h => h.toLowerCase().trim()
        });

        const productos = resultado.data
            .map(normalizarProducto)
            .filter(p => p.nombre && p.nombre.trim() !== "");

        console.log(`✅ ${productos.length} productos cargados`);
        return productos;
    } catch (error) {
        console.error("❌ Error cargando productos:", error);
        return null;
    }
}

function normalizarProducto(fila) {
    const get = (key1, key2 = "") => (fila[key1] || fila[key2] || "").toString().trim();

    const linkAfiliado = get("link_afiliado", "link afiliado") || "#";
    const tiendaManual = get("tienda");

    return {
        id: get("id") || get("nombre").toLowerCase().replace(/\s+/g, '-'),
        nombre: get("nombre"),
        categoria: get("categoria") || "Sin categoría",
        imagen: get("imagen") || "img/producto.jpg",
        precioActual: get("precio_actual", "precio actual") || "Consultar",
        precioAnterior: get("precio_anterior", "precio anterior") || "",
        rating: parseFloat(get("rating")) || 0,
        tag: get("tag") || "",
        resumen: get("resumen") || "Sin descripción disponible.",
        analisis: get("analisis"),
        rendimiento: get("rendimiento"),
        specs: parsePares(get("specs")),
        pros: parseLista(get("pros")),
        contras: parseLista(get("contras")),
        faq: parseFaq(get("faq")),
        linkAfiliado,
        tienda: tiendaManual || detectarTienda(linkAfiliado),
        destacado: get("destacado").toUpperCase() === "SI",
        fecha: get("fecha_actualizacion", "fecha actualizacion")
    };
}

/* Detecta automáticamente la tienda a partir del link de afiliado.
   Así, si en la planilla no completás la columna "tienda", el sitio
   igual sabe si mostrar "Ver en Amazon" o "Ver en Mercado Libre". */
function detectarTienda(link) {
    const url = (link || "").toLowerCase();
    if (url.includes("amazon.")) return "Amazon";
    if (url.includes("mercadolibre.") || url.includes("mercadolivre.") || url.includes("mlstatic.")) return "Mercado Libre";
    return "Tienda";
}

/* Normaliza texto para comparar categorías/búsquedas sin que rompan
   tildes, mayúsculas o espacios extra (ej: "Electrodomesticos" === "Electrodomésticos"). */
function normalizarTexto(texto) {
    return (texto || "")
        .toString()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim()
        .toLowerCase();
}

/* Devuelve los datos visuales (nombre de botón, ícono e info de la tienda)
   para el link de afiliado según la tienda detectada. */
function datosTienda(tienda) {
    const mapa = {
        "Amazon": { boton: "Ver precio en Amazon", icono: "🅰️" },
        "Mercado Libre": { boton: "Ver precio en Mercado Libre", icono: "🛒" },
    };
    return mapa[tienda] || { boton: "Ver precio en la tienda", icono: "🛍️" };
}

function parseLista(texto) {
    if (!texto) return [];
    return texto.split("|").map(s => s.trim()).filter(Boolean);
}

function parsePares(texto) {
    if (!texto) return [];
    return texto.split("|").map(par => {
        const [clave, valor] = par.split(":");
        return { clave: (clave || "").trim(), valor: (valor || "").trim() };
    }).filter(p => p.clave);
}

function parseFaq(texto) {
    if (!texto) return [];
    return texto.split("|").map(par => {
        const [pregunta, respuesta] = par.split("::");
        return { pregunta: (pregunta || "").trim(), respuesta: (respuesta || "").trim() };
    }).filter(f => f.pregunta);
}

function generarMedidor(rating) {
    let html = `<div class="medidor-energia" aria-label="${rating} de 5">`;
    for (let i = 1; i <= 5; i++) {
        html += `<svg class="rayo ${i <= Math.round(rating) ? "activo" : ""}" viewBox="0 0 24 24"><path d="M13 2 3 14h7l-1 8 10-12h-7l1-8z"/></svg>`;
    }
    html += `</div>`;
    return html;
}

function generarCardProducto(p) {
    return `
    <div class="card card-producto">
        <div class="card-producto-imagen">
            <img src="${p.imagen}" alt="${p.nombre}" loading="lazy">
        </div>
        <div class="card-producto-tags">
            <span class="destacado-tag">${p.tag || p.categoria}</span>
            <span class="tienda-tag tienda-tag--${normalizarTexto(p.tienda).replace(/\s+/g, '-')}">${datosTienda(p.tienda).icono} ${p.tienda}</span>
        </div>
        <h3>${p.nombre}</h3>
        ${generarMedidor(p.rating)}
        <p>${p.resumen}</p>
        <div class="card-producto-precio">
            <span class="precio-actual">${p.precioActual}</span>
            ${p.precioAnterior ? `<span class="precio-anterior">${p.precioAnterior}</span>` : ""}
        </div>
        <a href="producto.html?id=${encodeURIComponent(p.id)}" class="card-link">Ver ficha completa →</a>
    </div>`;
}