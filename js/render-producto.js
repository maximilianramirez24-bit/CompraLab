/* ==========================================================================
   RENDER-PRODUCTO.JS — Arma producto.html según el ?id= de la URL
<<<<<<< HEAD
   Además actualiza el <head> (title, description, canonical, Open Graph
   y datos estructurados JSON-LD) para que cada ficha se indexe como una
   página distinta en Google, no todas como "producto.html".
=======
>>>>>>> b927470f233d104a89b23c4b8e0c926f01c9dc22
   ========================================================================== */

document.addEventListener("DOMContentLoaded", async () => {
    const contenedor = document.getElementById("productoContenedor");
    if (!contenedor) return;

<<<<<<< HEAD
    contenedor.innerHTML = skeletonProducto();

=======
>>>>>>> b927470f233d104a89b23c4b8e0c926f01c9dc22
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

<<<<<<< HEAD
    actualizarSEOProducto(p, id);
=======
    document.title = `${p.nombre} — Reseña, Specs y Precio | Tu Marca`;
>>>>>>> b927470f233d104a89b23c4b8e0c926f01c9dc22

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
<<<<<<< HEAD
                    ${generarBadgeVerificado(p, "badge-verificado--bloque")}
=======
>>>>>>> b927470f233d104a89b23c4b8e0c926f01c9dc22
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
<<<<<<< HEAD

/* Placeholder animado mientras se descarga la planilla, en vez de dejar
   la página en blanco un instante. */
function skeletonProducto() {
    return `
        <div class="skeleton skeleton-linea" style="width: 140px; height: 14px; margin-bottom: 18px;"></div>
        <div class="skeleton skeleton-linea" style="width: 70%; height: 34px; margin-bottom: 12px;"></div>
        <div class="skeleton skeleton-linea" style="width: 45%; height: 16px; margin-bottom: 32px;"></div>
        <div class="producto-layout">
            <div>
                <div class="skeleton" style="aspect-ratio: 4/3; border-radius: var(--radius-lg);"></div>
            </div>
            <aside>
                <div class="skeleton" style="height: 320px; border-radius: var(--radius-md);"></div>
            </aside>
        </div>`;
}

/* Actualiza el <head> con la info específica de este producto: título,
   descripción, canonical, Open Graph y JSON-LD con precio y rating.
   Esto es lo que le permite a Google indexar cada ficha como una página
   propia (con su propio título) en vez de repetir "producto.html" para
   todos los productos. */
function actualizarSEOProducto(p, id) {
    const tituloSEO = `${p.nombre} — Reseña, Specs y Precio | Tu Marca`;
    const descripcionSEO = (p.resumen || `Análisis de ${p.nombre}: rendimiento, ficha técnica y dónde conseguirlo al mejor precio.`).slice(0, 160);
    const urlActual = `${window.location.origin}${window.location.pathname}?id=${encodeURIComponent(id)}`;

    document.title = tituloSEO;

    setAtributo('meta[name="description"]', "content", descripcionSEO);
    setAtributo('link[rel="canonical"]', "href", urlActual);
    setAtributo('meta[property="og:title"]', "content", tituloSEO);
    setAtributo('meta[property="og:description"]', "content", descripcionSEO);
    setAtributo('meta[property="og:url"]', "content", urlActual);
    setAtributo('meta[property="og:image"]', "content", p.imagen);
    setAtributo('meta[property="og:type"]', "content", "product");

    const precioNumerico = parsePrecioNumerico(p.precioActual);

    const jsonLd = {
        "@context": "https://schema.org/",
        "@type": "Product",
        "name": p.nombre,
        "description": descripcionSEO,
        "image": p.imagen,
        "url": urlActual,
    };

    // Solo se agrega el precio si pudimos interpretarlo como número
    // (si dice "Consultar" u otro texto libre, se omite en vez de mentir).
    if (precioNumerico !== null) {
        jsonLd.offers = {
            "@type": "Offer",
            "url": p.linkAfiliado,
            "priceCurrency": "ARS",
            "price": precioNumerico,
            "availability": "https://schema.org/InStock"
        };
    }

    // Se usa "review" (reseña editorial de Tu Marca) en vez de
    // "aggregateRating" porque el rating de la planilla es una nota
    // propia del sitio, no un promedio de reseñas de compradores reales.
    // Mezclar eso con aggregateRating puede infringir las políticas de
    // datos estructurados de Google.
    if (p.rating > 0) {
        jsonLd.review = {
            "@type": "Review",
            "author": { "@type": "Organization", "name": "Tu Marca" },
            "reviewRating": {
                "@type": "Rating",
                "ratingValue": p.rating,
                "bestRating": "5"
            }
        };
    }

    let script = document.getElementById("productoJsonLd");
    if (!script) {
        script = document.createElement("script");
        script.type = "application/ld+json";
        script.id = "productoJsonLd";
        document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(jsonLd);
}

function setAtributo(selector, atributo, valor) {
    if (!valor) return;
    const el = document.querySelector(selector);
    if (el) el.setAttribute(atributo, valor);
}
=======
>>>>>>> b927470f233d104a89b23c4b8e0c926f01c9dc22
