export function renderProducts(catalog, products) {

    catalog.innerHTML = '';

    for (let product of products) {

        const {
            title,
            description,
            price,
            images,
            availabilityStatus
        } = product;

        catalog.insertAdjacentHTML(
            'beforeend',
            `
            <div class="card">

                <div class="card-img-wrapper">
                    <img
                        src="${images[0]}"
                        alt="${title}"
                        loading="lazy"
                    />
                </div>

                <div class="card-body">
                    <h3 class="card-title">${title}</h3>

                    <p class="card-meta">
                        ${description}
                    </p>

                    <p class="card-meta">
                        $${price}
                    </p>

                    <p class="card-meta">
                        ${availabilityStatus}
                    </p>
                </div>

            </div>
            `
        );
    }
}

export function renderCategories(
    categories,
    catList,
    onClickCategory
) {

    catList.innerHTML = '';

    for (let cat of categories) {

        const btn = document.createElement('button');

        btn.className = 'cat-btn';
        btn.textContent = cat.name;

        btn.addEventListener('click', () => {
            onClickCategory(cat);
        });

        catList.appendChild(btn);
    }
}

export function showCatalog(
    catalogSection,
    resultsSection,
    formSearch,
    quantity,
    searchResults
) {

    resultsSection.style.display = 'none';

    catalogSection.style.display = '';

    formSearch.querySelector('input').value = '';

    quantity.textContent = '0';

    searchResults.innerHTML = '';
}