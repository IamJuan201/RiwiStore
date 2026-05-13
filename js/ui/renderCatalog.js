export function renderCatalogCards(container, products) {

    container.innerHTML = '';

    products.forEach(product => {

        const {
            title,
            description,
            price,
            thumbnail,
            availabilityStatus
        } = product;

        container.innerHTML += `
            <div class="card">

                <div class="card-img-wrapper">
                    <img 
                        src="${thumbnail || ''}" 
                        alt="${title}"
                        loading="lazy"
                        onerror="this.style.display='none'"
                    >
                </div>

                <div class="card-body">
                    <h3>${title}</h3>
                    <p>${description}</p>
                    <p>$${price}</p>
                    <p>${availabilityStatus}</p>
                </div>

            </div>
        `;
    });
}