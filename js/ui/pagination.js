// ui/pagination.js

import { LIMIT, state } from '../state/store.js';

export function renderPagination(
    pagination,
    loadPage
) {

    const totalPages = Math.ceil(
        state.totalProducts / LIMIT
    );

    if (totalPages <= 1) {

        pagination.innerHTML = '';

        return;
    }

    pagination.innerHTML = `
        <button
            class="page-btn"
            id="btn-prev"
            ${state.currentPage === 1 ? 'disabled' : ''}
        >
            ← Anterior
        </button>

        <span class="page-info">
            Página ${state.currentPage}
            de ${totalPages}
        </span>

        <button
            class="page-btn"
            id="btn-next"
            ${state.currentPage === totalPages ? 'disabled' : ''}
        >
            Siguiente →
        </button>
    `;

    document
        .getElementById('btn-prev')
        .addEventListener('click', () => {

            state.currentPage--;

            loadPage();
        });

    document
        .getElementById('btn-next')
        .addEventListener('click', () => {

            state.currentPage++;

            loadPage();
        });
}