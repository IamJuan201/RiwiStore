// Variables globales

const formSearch     = document.getElementById('frm-search');
const catalog        = document.getElementById('Catalog');
const searchResults  = document.getElementById('search-results');
const quantity       = document.getElementById('quantity');
const catList        = document.getElementById('cat-list');
const btnInicio      = document.getElementById('btn-inicio');
const siteLogo       = document.getElementById('site-logo');
const pagination     = document.getElementById('pagination');
const catalogSection = document.getElementById('catalog-section');
const resultsSection = document.getElementById('results-section');
const catalogTitle   = document.getElementById('catalog-title');
const resultTitle    = document.getElementById('results-title');

const LIMIT = 10;         // Productos por página
let currentPage   = 1;    // Página actual
let totalProducts = 0;    // Total que devuelve la API
let currentSlug   = null; // Categoría activa (null = todas)
let activeBtn     = btnInicio; // Botón del menú que está resaltado


// Cargar todos los productos

async function getProducts() {
    const skip = (currentPage - 1) * LIMIT;
    const response = await fetch(`https://dummyjson.com/products?limit=${LIMIT}&skip=${skip}`);
    const data = await response.json();

    totalProducts = data.total;
    catalog.innerHTML = '';

    for (let product of data.products) {
        const { title, description, price, images, availabilityStatus } = product;

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

    renderPagination();
}


// Cargar productos por categoría

async function getByCategory(slug, name) {
    const skip = (currentPage - 1) * LIMIT;
    const response = await fetch(`https://dummyjson.com/products/category/${slug}?limit=${LIMIT}&skip=${skip}`);
    const data = await response.json();

    totalProducts = data.total;
    catalogTitle.textContent = name;
    catalog.innerHTML = '';

    for (let product of data.products) {
        const { title, description, price, images, availabilityStatus } = product;

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

    renderPagination();
    showCatalog();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}


// Buscar productos

async function searchProducts(text) {
    const response = await fetch(`https://dummyjson.com/products/search?q=${text}`);
    const data = await response.json();

    resultTitle.textContent = `Resultados para "${text}"`;
    searchResults.innerHTML = '';

    if (data.total === 0) {
        quantity.textContent = 0;
        searchResults.innerHTML = '<p class="no-results">No se encontraron productos.</p>';
        showResults();
        return;
    }

    // Filtramos solo los que el título coincida exacto con lo buscado
    const filtrados = data.products.filter(function (product) {
        return product.title.toLowerCase().includes(text.toLowerCase());
    });

    quantity.textContent = filtrados.length;

    if (filtrados.length === 0) {
        searchResults.innerHTML = '<p class="no-results">No se encontraron productos.</p>';
        showResults();
        return;
    }

    for (let product of filtrados) {
        const { title, images, rating } = product;

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

    showResults();
}


// Cargar categorías

async function loadCategories() {
    const response = await fetch('https://dummyjson.com/products/categories');
    const cats = await response.json();

    catList.innerHTML = '';

    for (let cat of cats) {
        const { slug, name } = cat;

        const btn = document.createElement('button');
        btn.className   = 'cat-btn';
        btn.textContent = name;

        btn.addEventListener('click', function () {
            setActive(btn);
            currentSlug = slug;
            currentPage = 1;
            getByCategory(slug, name);
        });

        catList.appendChild(btn);
    }
}


// Paginación

function renderPagination() {
    // Cuántas páginas hay en total (redondeamos hacia arriba)
    const totalPages = Math.ceil(totalProducts / LIMIT);

    // Si hay 1 sola página no mostramos los botones
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

    document.getElementById('btn-prev').addEventListener('click', function () {
        currentPage--;
        loadPage();
    });

    document.getElementById('btn-next').addEventListener('click', function () {
        currentPage++;
        loadPage();
    });
}

// Decide qué función llamar según si hay categoría activa o no
function loadPage() {
    if (currentSlug) {
        getByCategory(currentSlug, catalogTitle.textContent);
    } else {
        getProducts();
    }
}


// Mostrar / ocultar secciones

function showCatalog() {
    resultsSection.style.display = 'none';
    catalogSection.style.display = '';
    formSearch.querySelector('input').value = '';
    quantity.textContent = '0';
    searchResults.innerHTML = '';
}

function showResults() {
    catalogSection.style.display = 'none';
    resultsSection.style.display = '';
}


// Botón activo del menú

function setActive(btn) {
    if (activeBtn) activeBtn.classList.remove('cat-btn--active');
    activeBtn = btn;
    btn.classList.add('cat-btn--active');
}


// Ir al inicio

function goHome() {
    setActive(btnInicio);
    currentSlug = null;
    currentPage = 1;
    catalogTitle.textContent = 'Todos los productos';
    showCatalog();
    getProducts();
}


// Eventos

siteLogo.addEventListener('click', goHome);
btnInicio.addEventListener('click', goHome);

formSearch.addEventListener('submit', function (event) {
    event.preventDefault();

    const text = this.querySelector('input').value.trim();

    if (text.length === 0) return;

    searchProducts(text);
    this.querySelector('input').value = '';
});


// Arranque

loadCategories();
getProducts();