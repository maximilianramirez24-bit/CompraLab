/* ==========================================================================
   RENDER-CATALOGO.JS — Arma la grilla de productos en productos.html
   Soporta: filtro por categoría (botones + ?cat= en la URL) y búsqueda
   por texto libre, combinados entre sí.
   ========================================================================== */

document.addEventListener("DOMContentLoaded", async () => {
    const contenedor = document.getElementById("catalogoGrid");
    const filtros = document.getElementById("catalogoFiltros");
    const buscador = document.getElementById("catalogoBuscador");
    const contador = document.getElementById("catalogoContador");
    if (!contenedor) return;

    contenedor.innerHTML = `<p class="estado-carga">Cargando productos…</p>`;

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
    const categorias = [...categoriasVistas.entries()]; // [ [claveNorm, etiqueta], ... ]

    const catParam = new URLSearchParams(window.location.search).get("cat") || "";
    const catParamNorm = normalizarTexto(catParam);

    let catActiva = categoriasVistas.has(catParamNorm) ? catParamNorm : "todas";
    let textoBusqueda = "";

    function filtrar() {
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

        return lista;
    }

    function pintar() {
        const lista = filtrar();

        contenedor.innerHTML = lista.length
            ? lista.map(generarCardProducto).join("")
            : `<p class="estado-error">No encontramos productos con ese criterio. Probá con otra categoría o palabra clave.</p>`;

        if (contador) {
            contador.textContent = lista.length === productos.length
                ? `${lista.length} producto${lista.length === 1 ? "" : "s"} en total`
                : `${lista.length} de ${productos.length} productos`;
        }
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
                pintar();
            });
        });
    }

    if (buscador) {
        buscador.addEventListener("input", (e) => {
            textoBusqueda = e.target.value;
            pintar();
        });
    }

    pintar();
});
