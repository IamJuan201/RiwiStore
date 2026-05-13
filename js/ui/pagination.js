export function renderPagination(
    container,
    currentPage,
    totalProducts,
    limit,
    onPrev,
    onNext
) {

    const totalPages = Math.ceil(totalProducts / limit);

    if (totalPages <= 1) {
        container.innerHTML = '';
        return;
    }

    container.innerHTML = `
        <button id="btn-prev"
            ${currentPage === 1 ? 'disabled' : ''}>
            ← Anterior
        </button>

        <span>
            Página ${currentPage} de ${totalPages}
        </span>

        <button id="btn-next"
            ${currentPage === totalPages ? 'disabled' : ''}>
            Siguiente →
        </button>
    `;

    document
        .getElementById('btn-prev')
        .addEventListener('click', onPrev);

    document
        .getElementById('btn-next')
        .addEventListener('click', onNext);
}