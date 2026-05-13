import { store } from './state/store.js';

import {
    getProducts,
    getProductsByCategory,
    getCategories,
    searchProducts
} from './api/productsApi.js';

import { renderCatalogCards } from './ui/renderCatalog.js';
import { renderSearchCards } from './ui/renderSearch.js';
import { renderPagination } from './ui/pagination.js';

document.addEventListener('DOMContentLoaded', () => {

    // =========================
    // DOM
    // =========================

    const catalog = document.getElementById('Catalog');
    const pagination = document.getElementById('pagination');
    const catList = document.getElementById('cat-list');
    const formSearch = document.getElementById('frm-search');
    const searchResults = document.getElementById('search-results');

    const catalogSection = document.getElementById('catalog-section');
    const resultsSection = document.getElementById('results-section');

    const quantity = document.getElementById('quantity');
    const resultTitle = document.getElementById('results-title');

    const btnInicio = document.getElementById('btn-inicio');

    // =========================
    // VISTAS
    // =========================

    function showCatalog() {
        catalogSection.style.display = '';
        resultsSection.style.display = 'none';
    }

    function showResults() {
        catalogSection.style.display = 'none';
        resultsSection.style.display = '';
    }

    // =========================
    // CARGA DE PRODUCTOS
    // =========================

    async function loadPage() {

        const skip = (store.currentPage - 1) * store.LIMIT;

        let data;

        if (store.currentSlug) {
            data = await getProductsByCategory(
                store.currentSlug,
                store.LIMIT,
                skip
            );
        } else {
            data = await getProducts(
                store.LIMIT,
                skip
            );
        }

        store.totalProducts = data.total;

        renderCatalogCards(catalog, data.products);

        renderPagination(
            pagination,
            store.currentPage,
            store.totalProducts,
            store.LIMIT,

            () => {
                store.currentPage--;
                loadPage();
            },

            () => {
                store.currentPage++;
                loadPage();
            }
        );
    }

    // =========================
    // CATEGORÍAS
    // =========================

    async function loadCategories() {

        const categories = await getCategories();

        catList.innerHTML = '';

        categories.forEach(cat => {

            const btn = document.createElement('button');

            btn.textContent = cat.name;
            btn.classList.add('cat-btn');

            btn.addEventListener('click', () => {

                store.currentSlug = cat.slug;
                store.currentPage = 1;

                document.querySelectorAll('.cat-btn')
                    .forEach(b => b.classList.remove('cat-btn--active'));

                btn.classList.add('cat-btn--active');

                showCatalog();
                loadPage();
            });

            catList.appendChild(btn);
        });
    }

    // =========================
    // BÚSQUEDA
    // =========================

    formSearch.addEventListener('submit', async (e) => {

        e.preventDefault();

        const text = formSearch.querySelector('input').value.trim();

        if (!text) return;

        const data = await searchProducts(text);

        renderSearchCards(searchResults, data.products);

        quantity.textContent = data.products.length;
        resultTitle.textContent = `Resultados para "${text}"`;

        showResults();
    });

    // =========================
    // INICIO (HOME)
    // =========================

    btnInicio.addEventListener('click', () => {

        store.currentSlug = null;
        store.currentPage = 1;

        document.querySelectorAll('.cat-btn')
            .forEach(b => b.classList.remove('cat-btn--active'));

        btnInicio.classList.add('cat-btn--active');

        showCatalog();
        loadPage();
    });

    // Click logo también vuelve al inicio
    document.getElementById('site-logo').addEventListener('click', () => {

        store.currentSlug = null;
        store.currentPage = 1;

        document.querySelectorAll('.cat-btn')
            .forEach(b => b.classList.remove('cat-btn--active'));

        btnInicio.classList.add('cat-btn--active');

        showCatalog();
        loadPage();
    });

    // =========================
    // INIT
    // =========================

    loadCategories();
    loadPage();
});