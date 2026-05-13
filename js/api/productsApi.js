const BASE_URL = 'https://dummyjson.com/products';

export class ProductsAPI {

    static async getProducts(limit, skip) {

        const response = await fetch(
            `${BASE_URL}?limit=${limit}&skip=${skip}`
        );

        return await response.json();
    }

    static async getByCategory(slug, limit, skip) {

        const response = await fetch(
            `${BASE_URL}/category/${slug}?limit=${limit}&skip=${skip}`
        );

        return await response.json();
    }

    static async search(text) {

        const response = await fetch(
            `${BASE_URL}/search?q=${text}`
        );

        return await response.json();
    }
}