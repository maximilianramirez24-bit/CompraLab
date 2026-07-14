/* ==========================================================================
   RENDER-HOME.JS — Pinta el "Destacado de la semana" en index.html
   ========================================================================== */

document.addEventListener("DOMContentLoaded", async () => {
    const contenedor = document.getElementById("destacadoContenedor");
    if (!contenedor) return;

    const productos = await cargarProductos();

    if (!productos || productos.length === 0) {
        contenedor.innerHTML = `<p class="estado-error">Todavía no hay productos cargados en la planilla.</p>`;
        return;
    }

    const producto = productos.find(p => p.destacado) || productos[0];

    contenedor.innerHTML = `
        <div class="destacado-imagen">
            <img src="${producto.imagen}" alt="${producto.nombre}">
        </div>
        <div>
            <span class="destacado-tag">${producto.tag || "Mejor relación precio-calidad"}</span>
            <h3 style="font-size: 1.6rem; margin-bottom: 10px;">${producto.nombre}</h3>
            <p>${producto.resumen}</p>
            <div class="destacado-precio">
                <span class="precio-actual">${producto.precioActual}</span>
                ${producto.precioAnterior ? `<span class="precio-anterior">${producto.precioAnterior}</span>` : ""}
            </div>
            <a href="producto.html?id=${encodeURIComponent(producto.id)}" class="btn btn-primario">Ver ficha completa →</a>
        </div>`;
});
