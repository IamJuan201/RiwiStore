const BASE_URL = 'https://dummyjson.com/products';

export async function getProducts(limit, skip) {
    const response = await fetch(
        `${BASE_URL}?limit=${limit}&skip=${skip}`
    );

    return await response.json();
}

export async function getByCategory(slug, limit, skip) {
    const response = await fetch(
        `${BASE_URL}/category/${slug}?limit=${limit}&skip=${skip}`
    );

    return await response.json();
}

export async function searchProducts(text) {
    const response = await fetch(
        `${BASE_URL}/search?q=${text}`
    );

    return await response.json();
}

export async function getCategories() {
    const response = await fetch(
        `${BASE_URL}/categories`
    );

    return await response.json();
}