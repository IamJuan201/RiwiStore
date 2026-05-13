export function renderSearchCards(container, products) {

    container.innerHTML = '';

    products.forEach(product => {

        const {
            title,
            thumbnail,
            rating
        } = product;

        container.innerHTML += `
            <div class="card">

                <img 
                    src="${thumbnail}" 
                    alt="${title}"
                >

                <div class="card-body">
                    <h3>${title}</h3>
                    <span>★ ${rating}</span>
                </div>

            </div>
        `;
    });
}