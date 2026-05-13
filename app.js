document.addEventListener('DOMContentLoaded', function () {

    // Elementos del DOM
    const formSearch     = document.getElementById('frm-search');
    const catalog        = document.getElementById('Catalog');
    const searchResults  = document.getElementById('search-results');
    const quantity       = document.getElementById('quantity');
    const resultsSection = document.getElementById('results-section');
    const catalogSection = document.getElementById('catalog-section');
    const catalogTitle   = document.getElementById('catalog-title');
    const resultTitle    = document.getElementById('results-title');
    const catList        = document.getElementById('cat-list');
    const btnInicio      = document.getElementById('btn-inicio');
    const siteLogo       = document.getElementById('site-logo');
    const pagination     = document.getElementById('pagination');
    const categoryNav    = document.querySelector('.category-nav');

    // Estado de paginación
    const LIMIT = 10;           // productos por página
    let currentPage  = 1;
    let totalProducts = 0;
    let currentSlug  = null;    // null = todos, 'beauty' = categoría

    // Estado activo de categoría
    let activeBtn = btnInicio;

    function setActive(btn) {
        if (activeBtn) activeBtn.classList.remove('cat-btn--active');
        activeBtn = btn;
        btn.classList.add('cat-btn--active');
    }

    // Vista: mostrar catálogo, ocultar resultados
    function showCatalog() {
        resultsSection.style.display = 'none';
        catalogSection.style.display = '';
        formSearch.querySelector('input').value = '';
        quantity.textContent = '0';
        searchResults.innerHTML = '';
    }

    // Vista: mostrar resultados, ocultar catálogo
    function showResults() {
        catalogSection.style.display = 'none';
        resultsSection.style.display = '';
    }

    // Renderizar tarjetas de catálogo
    function renderCatalogCards(products) {
        catalog.innerHTML = '';
        for (const { title, description, price, images, availabilityStatus } of products) {
            catalog.innerHTML += `
            <div class="card">
                <div class="card-img-wrapper">
                    <img src="${images[0]}" alt="${title}" loading="lazy" />
                </div>
                <div class="card-body">
                    <h3 class="card-title">${title}</h3>
                    <p class="card-meta">${description}</p>
                    <p class="card-meta">$${price}</p>
                    <p class="card-meta">${availabilityStatus}</p>
                </div>
            </div>`;
        }
    }

    // Renderizar tarjetas de búsqueda
    function renderSearchCards(products) {
        searchResults.innerHTML = '';
        for (const { title, images, rating } of products) {
            searchResults.innerHTML += `
            <div class="card">
                <div class="card-img-wrapper">
                    <img src="${images[0]}" alt="${title}" loading="lazy" />
                </div>
                <div class="card-body">
                    <div class="card-header-row">
                        <h3 class="card-title">${title}</h3>
                        <span class="card-rating">★ ${rating}</span>
                    </div>
                </div>
            </div>`;
        }
    }

    // Renderizar paginación
    function renderPagination() {
        const totalPages = Math.ceil(totalProducts / LIMIT);

        // Si solo hay 1 página no se muestra
        if (totalPages <= 1) {
            pagination.innerHTML = '';
            return;
        }

        pagination.innerHTML = `
            <button class="page-btn" id="btn-prev" ${currentPage === 1 ? 'disabled' : ''}>
                ← Anterior
            </button>
            <span class="page-info">Página ${currentPage} de ${totalPages}</span>
            <button class="page-btn" id="btn-next" ${currentPage === totalPages ? 'disabled' : ''}>
                Siguiente →
            </button>
        `;

        document.getElementById('btn-prev').addEventListener('click', () => {
            currentPage--;
            loadPage();
        });

        document.getElementById('btn-next').addEventListener('click', () => {
            currentPage++;
            loadPage();
        });
    }

    // Cargar página según estado actual
    async function loadPage() {
        const skip = (currentPage - 1) * LIMIT;
        let url;

        if (currentSlug) {
            url = `https://dummyjson.com/products/category/${currentSlug}?limit=${LIMIT}&skip=${skip}`;
        } else {
            url = `https://dummyjson.com/products?limit=${LIMIT}&skip=${skip}`;
        }

        const res  = await fetch(url);
        const data = await res.json();

        totalProducts = data.total;
        renderCatalogCards(data.products);
        renderPagination();

        // Volver al tope de la página
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Cargar todos los productos (inicio)
    function getProducts() {
        catalogTitle.textContent = 'Todos los productos';
        currentSlug = null;
        currentPage = 1;
        loadPage();
    }

    // Cargar por categoría
    function getByCategory(slug, name) {
        catalogTitle.textContent = name;
        currentSlug = slug;
        currentPage = 1;
        loadPage();
        showCatalog();
    }

    // Cargar categorías y renderizar botones
    async function loadCategories() {
        const res  = await fetch('https://dummyjson.com/products/categories');
        const cats = await res.json();

        catList.innerHTML = '';
        for (const { slug, name } of cats) {
            const btn = document.createElement('button');
            btn.className   = 'cat-btn';
            btn.textContent = name;
            btn.addEventListener('click', () => {
                setActive(btn);
                getByCategory(slug, name);
            });
            catList.appendChild(btn);
        }
    }

    // Buscar productos (sin paginación, muestra todos los resultados)
    async function searchProducts(text) {
        const res  = await fetch(`https://dummyjson.com/products/search?q=${text}`);
        const data = await res.json();

        if (data.total === 0) {
            quantity.textContent = 0;
            resultTitle.textContent = `Resultados para "${text}"`;
            searchResults.innerHTML = '<p class="no-results">No se encontraron productos.</p>';
            showResults();
            return;
        }

        // Filtrar solo los que el título incluya el texto buscado
        const filtrados = data.products.filter(p =>
            p.title.toLowerCase().includes(text.toLowerCase())
        );

        quantity.textContent = filtrados.length;
        resultTitle.textContent = `Resultados para "${text}"`;

        if (filtrados.length === 0) {
            searchResults.innerHTML = '<p class="no-results">No se encontraron productos.</p>';
            showResults();
            return;
        }

        renderSearchCards(filtrados);
        showResults();
    }

    // Inicio
    function goHome() {
        setActive(btnInicio);
        showCatalog();
        getProducts();
    }

    siteLogo.addEventListener('click', goHome);
    btnInicio.addEventListener('click', goHome);

    formSearch.addEventListener('submit', function (e) {
        e.preventDefault();
        const text = this.querySelector('input').value.trim();
        if (!text) return;
        searchProducts(text);
        this.querySelector('input').value = '';
    });

    // Arrancar
    loadCategories();
    getProducts();
});