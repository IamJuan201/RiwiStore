import {
    getProducts,
    getByCategory,
    searchProducts,
    getCategories
}
from './api/productsApi.js';

import {
    renderProducts,
    renderCategories,
    showCatalog
}
from './ui/renderCatalog.js';

import {
    renderSearchResults,
    showResults
}
from './ui/renderSearch.js';

import {
    renderPagination
}
from './ui/pagination.js';

import {
    state,
    LIMIT
}
from './state/store.js';


// DOM

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


// Productos

async function loadProducts() {

    const skip =
        (state.currentPage - 1) * LIMIT;

    let data;

    if (state.currentSlug) {

        data = await getByCategory(
            state.currentSlug,
            LIMIT,
            skip
        );

    } else {

        data = await getProducts(
            LIMIT,
            skip
        );
    }

    state.totalProducts = data.total;

    renderProducts(
        catalog,
        data.products
    );

    renderPagination(
        pagination,
        loadProducts
    );
}


// Buscar

async function handleSearch(text) {

    const data =
        await searchProducts(text);

    const filtered =
        data.products.filter(product => {

            return product.title
                .toLowerCase()
                .includes(text.toLowerCase());
        });

    resultTitle.textContent =
        `Resultados para "${text}"`;

    quantity.textContent =
        filtered.length;

    if (filtered.length === 0) {

        searchResults.innerHTML =
            '<p class="no-results">No se encontraron productos.</p>';

        showResults(
            catalogSection,
            resultsSection
        );

        return;
    }

    renderSearchResults(
        searchResults,
        filtered
    );

    showResults(
        catalogSection,
        resultsSection
    );
}


// Categorías

async function loadAllCategories() {

    const categories =
        await getCategories();

    renderCategories(
        categories,
        catList,
        category => {

            state.currentSlug =
                category.slug;

            state.currentPage = 1;

            catalogTitle.textContent =
                category.name;

            loadProducts();

            showCatalog(
                catalogSection,
                resultsSection,
                formSearch,
                quantity,
                searchResults
            );

            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
    );
}


// Inicio

function goHome() {

    state.currentSlug = null;

    state.currentPage = 1;

    catalogTitle.textContent =
        'Todos los productos';

    showCatalog(
        catalogSection,
        resultsSection,
        formSearch,
        quantity,
        searchResults
    );

    loadProducts();
}


// Eventos

formSearch.addEventListener(
    'submit',
    event => {

        event.preventDefault();

        const text =
            formSearch
            .querySelector('input')
            .value
            .trim();

        if (!text) return;

        handleSearch(text);

        formSearch.querySelector('input').value = '';
    }
);

btnInicio.addEventListener(
    'click',
    goHome
);

siteLogo.addEventListener(
    'click',
    goHome
);


// Arranque

loadAllCategories();

loadProducts();