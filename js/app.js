import { ProductsAPI } from './api/productsApi.js';

class StoreApp {

    constructor() {

        this.catalog = document.getElementById('Catalog');

        this.currentPage = 1;

        this.limit = 10;

        this.init();
    }

    async init() {

        await this.loadProducts();
    }

    async loadProducts() {

        const skip =
            (this.currentPage - 1) * this.limit;

        const data =
            await ProductsAPI.getProducts(
                this.limit,
                skip
            );

        this.renderProducts(data.products);
    }

    renderProducts(products) {

        this.catalog.innerHTML = '';

        for (let product of products) {

            this.catalog.insertAdjacentHTML(
                'beforeend',
                `
                <div class="card">

                    <img src="${product.images[0]}">

                    <h3>${product.title}</h3>

                </div>
                `
            );
        }
    }
}

new StoreApp();