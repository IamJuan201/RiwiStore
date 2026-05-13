// ui/renderSearch.js

export function renderSearchResults(
    searchResults,
    products
) {

    searchResults.innerHTML = '';

    for (let product of products) {

        const {
            title,
            images,
            rating
        } = product;

        searchResults.insertAdjacentHTML(
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

                    <div class="card-header-row">

                        <h3 class="card-title">
                            ${title}
                        </h3>

                        <span class="card-rating">
                            ★ ${rating}
                        </span>

                    </div>

                </div>

            </div>
            `
        );
    }
}

export function showResults(
    catalogSection,
    resultsSection
) {

    catalogSection.style.display = 'none';

    resultsSection.style.display = '';
}