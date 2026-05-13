const BASE_URL = 'https://dummyjson.com/products';

export async function getProducts(limit, skip) {

    const res = await fetch(
        `${BASE_URL}?limit=${limit}&skip=${skip}`
    );

    return await res.json();
}

export async function getProductsByCategory(
    slug,
    limit,
    skip
) {

    const res = await fetch(
        `${BASE_URL}/category/${slug}?limit=${limit}&skip=${skip}`
    );

    return await res.json();
}

export async function searchProducts(query) {

    const res = await fetch(
        `${BASE_URL}/search?q=${query}`
    );

    return await res.json();
}

export async function getCategories() {

    const res = await fetch(
        `${BASE_URL}/categories`
    );

    return await res.json();
}