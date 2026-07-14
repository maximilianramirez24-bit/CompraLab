/* ==========================================================================
   RENDER-PRODUCTO.JS — Arma producto.html según el ?id= de la URL
   ========================================================================== */

document.addEventListener("DOMContentLoaded", async () => {
    const contenedor = document.getElementById("productoContenedor");
    if (!contenedor) return;

    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");

    if (!id) {
        contenedor.innerHTML = `<p class="estado-error">Falta indicar qué producto mostrar. Volvé al <a href="productos.html">catálogo</a> y elegí uno.</p>`;
        return;
    }

    const productos = await cargarProductos();

    if (productos === null) {
        contenedor.innerHTML = `<p class="estado-error">No pudimos cargar los productos. Revisá el link de la planilla en <code>js/productos.js</code>.</p>`;
        return;
    }

    const p = productos.find(prod => prod.id === id);

    if (!p) {
        contenedor.innerHTML = `<p class="estado-error">No encontramos ese producto. Volvé al <a href="productos.html">catálogo</a>.</p>`;
        return;
    }

    document.title = `${p.nombre} — Reseña, Specs y Precio | Tu Marca`;

    const breadcrumb = document.getElementById("breadcrumbCategoria");
    if (breadcrumb) {
        breadcrumb.textContent = p.categoria;
        breadcrumb.href = `productos.html?cat=${encodeURIComponent(p.categoria)}`;
    }

    contenedor.innerHTML = `
        <header style="margin-bottom: 28px;">
            <span class="eyebrow">Actualizado ${p.fecha || ""}</span>
            <h1>${p.nombre}</h1>
            <p class="lead" style="color: var(--text-muted); margin-top: 10px;">${p.resumen}</p>
        </header>

        <div class="producto-layout">
            <div>
                <div class="producto-imagen">
                    <img src="${p.imagen}" alt="${p.nombre}">
                </div>

                ${(p.pros.length || p.contras.length) ? `
                <div class="veredicto">
                    <div class="pros">
                        <h4>Lo mejor</h4>
                        <ul>${p.pros.map(x => `<li>${x}</li>`).join("")}</ul>
                    </div>
                    <div class="contras">
                        <h4>A tener en cuenta</h4>
                        <ul>${p.contras.map(x => `<li>${x}</li>`).join("")}</ul>
                    </div>
                </div>` : ""}

                ${p.analisis ? `
                <section>
                    <h2>Análisis del producto</h2>
                    <p>${p.analisis}</p>
                </section>` : ""}

                ${p.rendimiento ? `
                <section>
                    <h2>Rendimiento y diseño</h2>
                    <p>${p.rendimiento}</p>
                </section>` : ""}

                ${p.specs.length ? `
                <section>
                    <h2>Ficha técnica</h2>
                    <table class="tabla-specs">
                        ${p.specs.map(s => `<tr><td>${s.clave}</td><td>${s.valor}</td></tr>`).join("")}
                    </table>
                </section>` : ""}

                ${p.faq.length ? `
                <section>
                    <h2>Preguntas frecuentes</h2>
                    ${p.faq.map(f => `
                        <div class="faq-item">
                            <h4>${f.pregunta}</h4>
                            <p>${f.respuesta}</p>
                        </div>`).join("")}
                </section>` : ""}
            </div>

            <aside class="sidebar-sticky">
                <div class="card-precio">
                    ${p.tag ? `<span class="destacado-tag">${p.tag}</span>` : ""}
                    ${generarMedidor(p.rating)}
                    <span class="precio-actual">${p.precioActual}</span>
                    ${p.precioAnterior ? `<span class="precio-anterior">${p.precioAnterior}</span>` : ""}
                    <div style="margin-top: 18px;">
                        <a href="${p.linkAfiliado}" target="_blank" rel="nofollow sponsored noopener" class="btn-afiliado" style="width: 100%; justify-content: center;">
                            ${datosTienda(p.tienda).icono} ${datosTienda(p.tienda).boton}
                        </a>
                    </div>
                    <p class="aviso-mini">
                        ${p.tienda === "Amazon"
                            ? "Como Afiliados de Amazon, obtenemos ingresos por las compras adscritas que cumplen los requisitos aplicables."
                            : "Como afiliados, podemos ganar una comisión por esta compra, sin costo adicional para vos."}
                    </p>
                </div>
            </aside>
        </div>`;

    // Reactiva el acordeón de FAQ para el contenido recién insertado
    contenedor.querySelectorAll(".faq-item h4").forEach((titulo) => {
        titulo.addEventListener("click", () => {
            const parrafo = titulo.nextElementSibling;
            if (parrafo) {
                parrafo.style.display = parrafo.style.display === "none" ? "block" : "none";
            }
        });
    });
});
