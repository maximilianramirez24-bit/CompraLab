/* ==========================================================================
   RENDER-CATALOGO.JS — Arma la grilla de productos en productos.html
   Soporta: filtro por categoría (botones + ?cat= en la URL), búsqueda por
   texto, orden (precio/rating), filtro por rango de precio y "cargar más".
   ========================================================================== */

const ITEMS_POR_PAGINA = 9;

document.addEventListener("DOMContentLoaded", async () => {
    const contenedor = document.getElementById("catalogoGrid");
    const filtros = document.getElementById("catalogoFiltros");
    const buscador = document.getElementById("catalogoBuscador");
    const contador = document.getElementById("catalogoContador");
    const selectOrden = document.getElementById("catalogoOrden");
    const inputMin = document.getElementById("precioMin");
    const inputMax = document.getElementById("precioMax");
    const btnCargarMas = document.getElementById("catalogoCargarMas");
    if (!contenedor) return;

    contenedor.innerHTML = skeletonCatalogo();

    const productos = await cargarProductos();

    if (productos === null) {
        contenedor.innerHTML = `<p class="estado-error">No pudimos cargar los productos. Revisá que el link de la planilla en <code>js/productos.js</code> esté bien configurado y publicado como CSV.</p>`;
        return;
    }

    if (productos.length === 0) {
        contenedor.innerHTML = `<p class="estado-error">Todavía no cargaste ningún producto en la planilla.</p>`;
        return;
    }

    // Lista de categorías reales, sin duplicados por tildes/mayúsculas
    const categoriasVistas = new Map(); // clave normalizada -> etiqueta original
    productos.forEach(p => {
        const clave = normalizarTexto(p.categoria);
        if (clave && !categoriasVistas.has(clave)) categoriasVistas.set(clave, p.categoria);
    });
    const categorias = [...categoriasVistas.entries()];

    const catParam = new URLSearchParams(window.location.search).get("cat") || "";
    const catParamNorm = normalizarTexto(catParam);

    let catActiva = categoriasVistas.has(catParamNorm) ? catParamNorm : "todas";
    let textoBusqueda = "";
    let visibles = ITEMS_POR_PAGINA;

    function filtrarYOrdenar() {
        let lista = productos;

        if (catActiva !== "todas") {
            lista = lista.filter(p => normalizarTexto(p.categoria) === catActiva);
        }

        if (textoBusqueda.trim() !== "") {
            const q = normalizarTexto(textoBusqueda);
            lista = lista.filter(p =>
                normalizarTexto(p.nombre).includes(q) ||
                normalizarTexto(p.resumen).includes(q) ||
                normalizarTexto(p.tag).includes(q)
            );
        }

        const min = inputMin && inputMin.value !== "" ? parseFloat(inputMin.value) : null;
        const max = inputMax && inputMax.value !== "" ? parseFloat(inputMax.value) : null;
        if (min !== null || max !== null) {
            lista = lista.filter(p => {
                const precio = parsePrecioNumerico(p.precioActual);
                if (precio === null) return false; // si no tiene precio numérico, no se puede ubicar en un rango
                if (min !== null && precio < min) return false;
                if (max !== null && precio > max) return false;
                return true;
            });
        }

        const orden = selectOrden ? selectOrden.value : "relevancia";
        if (orden !== "relevancia") {
            lista = [...lista].sort((a, b) => {
                if (orden === "precio-asc" || orden === "precio-desc") {
                    const pa = parsePrecioNumerico(a.precioActual);
                    const pb = parsePrecioNumerico(b.precioActual);
                    if (pa === null) return 1;  // sin precio numérico, al final
                    if (pb === null) return -1;
                    return orden === "precio-asc" ? pa - pb : pb - pa;
                }
                if (orden === "rating-desc") {
                    return b.rating - a.rating;
                }
                return 0;
            });
        }

        return lista;
    }

    function pintar() {
        const listaCompleta = filtrarYOrdenar();
        const lista = listaCompleta.slice(0, visibles);

        contenedor.innerHTML = lista.length
            ? lista.map(generarCardProducto).join("")
            : `<p class="estado-error">No encontramos productos con ese criterio. Probá con otra categoría, precio o palabra clave.</p>`;

        if (contador) {
            contador.textContent = listaCompleta.length === productos.length
                ? `${productos.length} producto${productos.length === 1 ? "" : "s"} en total`
                : `${listaCompleta.length} de ${productos.length} productos`;
        }

        if (btnCargarMas) {
            btnCargarMas.hidden = listaCompleta.length <= visibles;
        }
    }

    function reiniciarYPintar() {
        visibles = ITEMS_POR_PAGINA;
        pintar();
    }

    if (filtros && categorias.length > 0) {
        filtros.innerHTML = `<button class="btn-filtro" data-cat="todas">Todas</button>` +
            categorias.map(([clave, etiqueta]) => `<button class="btn-filtro" data-cat="${clave}">${etiqueta}</button>`).join("");

        filtros.querySelectorAll(".btn-filtro").forEach(btn => {
            btn.classList.toggle("activo", btn.dataset.cat === catActiva);
            btn.addEventListener("click", () => {
                filtros.querySelectorAll(".btn-filtro").forEach(b => b.classList.remove("activo"));
                btn.classList.add("activo");
                catActiva = btn.dataset.cat;
                reiniciarYPintar();
            });
        });
    }

    if (buscador) {
        buscador.addEventListener("input", (e) => {
            textoBusqueda = e.target.value;
            reiniciarYPintar();
        });
    }

    if (selectOrden) selectOrden.addEventListener("change", reiniciarYPintar);
    if (inputMin) inputMin.addEventListener("input", debounce(reiniciarYPintar, 400));
    if (inputMax) inputMax.addEventListener("input", debounce(reiniciarYPintar, 400));

    if (btnCargarMas) {
        btnCargarMas.addEventListener("click", () => {
            visibles += ITEMS_POR_PAGINA;
            pintar();
        });
    }

    pintar();
});

function debounce(fn, espera) {
    let temporizador;
    return (...args) => {
        clearTimeout(temporizador);
        temporizador = setTimeout(() => fn(...args), espera);
    };
}

/* Placeholders animados mientras se descarga la planilla, en vez de
   dejar la grilla vacía o con un texto plano de "Cargando…". */
function skeletonCatalogo() {
    return Array.from({ length: 6 })
        .map(() => `<div class="skeleton skeleton-card"></div>`)
        .join("");
}
