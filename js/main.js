document.addEventListener('DOMContentLoaded', () => {

    /* 1. Menú responsive */
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.getElementById('navLinks');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            const abierto = navLinks.classList.toggle('abierto');
            menuToggle.setAttribute('aria-expanded', abierto ? 'true' : 'false');
        });

        // Cierra el menú al elegir una opción (útil en mobile)
        navLinks.querySelectorAll('a').forEach((link) => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('abierto');
                menuToggle.setAttribute('aria-expanded', 'false');
            });
        });
    }

    /* 2. Botón "Volver arriba" */
    const backToTop = document.createElement('button');
    backToTop.innerText = '↑';
    backToTop.classList.add('back-to-top');
    backToTop.setAttribute('aria-label', 'Volver arriba');
    document.body.appendChild(backToTop);

    window.addEventListener('scroll', () => {
        backToTop.style.display = window.scrollY > 300 ? 'flex' : 'none';
    });

    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    /* 3. Modo oscuro con preferencia guardada */
    const aplicarPreferenciaOscura = () => {
        const guardado = localStorage.getItem('modoOscuro');
        const prefiereOscuro = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (guardado === 'true' || (guardado === null && prefiereOscuro)) {
            document.body.classList.add('dark-mode');
        }
    };
    aplicarPreferenciaOscura();

    const darkToggle = document.getElementById('darkToggle');
    if (darkToggle) {
        darkToggle.addEventListener('click', () => {
            const activo = document.body.classList.toggle('dark-mode');
            localStorage.setItem('modoOscuro', activo);
        });
    }

    /* 4. FAQ acordeón simple (producto.html) */
    document.querySelectorAll('.faq-item h4').forEach((titulo) => {
        titulo.addEventListener('click', () => {
            const parrafo = titulo.nextElementSibling;
            if (parrafo) {
                parrafo.style.display = parrafo.style.display === 'none' ? 'block' : 'none';
            }
        });
    });

});
