document.addEventListener('DOMContentLoaded', function () {

    // ── Elementos del DOM ──────────────────────────────────────────
    const formSearch     = document.getElementById('frm-search');
    const catalog        = document.getElementById('Catalog');
    const searchResults  = document.getElementById('search-results');
    const quantity       = document.getElementById('quantity');
    const resultsSection = document.getElementById('results-section');
    const catalogSection = document.getElementById('catalog-section');
    const catalogTitle   = document.getElementById('catalog-title');
    const resultTitle    = document.getElementById('results-title');
    const catList        = document.getElementById('cat-list');
    const btnInicio      = document.getElementById('btn-inicio');
    const siteLogo       = document.getElementById('site-logo');
    const pagination     = document.getElementById('pagination');

    // ── Estado de paginación ───────────────────────────────────────
    const LIMIT = 10;           // productos por página
    let currentPage  = 1;
    let totalProducts = 0;
    let currentSlug  = null;    // null = todos, 'beauty' = categoría

    // ── Estado activo de categoría ──────────────────────────────────
    let activeBtn = btnInicio;

    function setActive(btn) {
        if (activeBtn) activeBtn.classList.remove('cat-btn--active');
        activeBtn = btn;
        btn.classList.add('cat-btn--active');
    }

    // ── Vista: mostrar catálogo, ocultar resultados ─────────────────
    function showCatalog() {
        resultsSection.style.display = 'none';
        catalogSection.style.display = '';
        formSearch.querySelector('input').value = '';
        quantity.textContent = '0';
        searchResults.innerHTML = '';
    }

    // ── Vista: mostrar resultados, ocultar catálogo ─────────────────
    function showResults() {
        catalogSection.style.display = 'none';
        resultsSection.style.display = '';
    }

    // ── Renderizar tarjetas de catálogo ─────────────────────────────
    function renderCatalogCards(products) {
        catalog.innerHTML = '';
        for (const { title, description, price, images, availabilityStatus } of products) {
            catalog.innerHTML += `
            <div class="card">
                <div class="card-img-wrapper">
                    <img src="${images[0]}" alt="${title}" loading="lazy" />
                </div>
                <div class="card-body">
                    <h3 class="card-title">${title}</h3>
                    <p class="card-meta">${description}</p>
                    <p class="card-meta">$${price}</p>
                    <p class="card-meta">${availabilityStatus}</p>
                </div>
            </div>`;
        }
    }

    // ── Renderizar tarjetas de búsqueda ─────────────────────────────
    function renderSearchCards(products) {
        searchResults.innerHTML = '';
        for (const { title, images, rating } of products) {
            searchResults.innerHTML += `
            <div class="card">
                <div class="card-img-wrapper">
                    <img src="${images[0]}" alt="${title}" loading="lazy" />
                </div>
                <div class="card-body">
                    <div class="card-header-row">
                        <h3 class="card-title">${title}</h3>
                        <span class="card-rating">★ ${rating}</span>
                    </div>
                </div>
            </div>`;
        }
    }

    // ── Renderizar paginación ────────────────────────────────────────
    function renderPagination() {
        const totalPages = Math.ceil(totalProducts / LIMIT);

        // Si solo hay 1 página no se muestra
        if (totalPages <= 1) {
            pagination.innerHTML = '';
            return;
        }

        pagination.innerHTML = `
            <button class="page-btn" id="btn-prev" ${currentPage === 1 ? 'disabled' : ''}>
                ← Anterior
            </button>
            <span class="page-info">Página ${currentPage} de ${totalPages}</span>
            <button class="page-btn" id="btn-next" ${currentPage === totalPages ? 'disabled' : ''}>
                Siguiente →
            </button>
        `;

        document.getElementById('btn-prev').addEventListener('click', () => {
            currentPage--;
            loadPage();
        });

        document.getElementById('btn-next').addEventListener('click', () => {
            currentPage++;
            loadPage();
        });
    }

    // ── Cargar página según estado actual ────────────────────────────
    async function loadPage() {
        const skip = (currentPage - 1) * LIMIT;
        let url;

        if (currentSlug) {
            url = `https://dummyjson.com/products/category/${currentSlug}?limit=${LIMIT}&skip=${skip}`;
        } else {
            url = `https://dummyjson.com/products?limit=${LIMIT}&skip=${skip}`;
        }

        const res  = await fetch(url);
        const data = await res.json();

        totalProducts = data.total;
        renderCatalogCards(data.products);
        renderPagination();

        // Volver al tope de la página
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // ── Cargar todos los productos (inicio) ──────────────────────────
    function getProducts() {
        catalogTitle.textContent = 'Todos los productos';
        currentSlug = null;
        currentPage = 1;
        loadPage();
    }

    // ── Cargar por categoría ─────────────────────────────────────────
    function getByCategory(slug, name) {
        catalogTitle.textContent = name;
        currentSlug = slug;
        currentPage = 1;
        loadPage();
        showCatalog();
    }

    // ── Cargar categorías y renderizar botones ───────────────────────
    async function loadCategories() {
        const res  = await fetch('https://dummyjson.com/products/categories');
        const cats = await res.json();

        catList.innerHTML = '';
        for (const { slug, name } of cats) {
            const btn = document.createElement('button');
            btn.className   = 'cat-btn';
            btn.textContent = name;
            btn.addEventListener('click', () => {
                setActive(btn);
                getByCategory(slug, name);
            });
            catList.appendChild(btn);
        }
    }

    // ── Buscar productos (sin paginación, muestra todos los resultados)
    async function searchProducts(text) {
        const res  = await fetch(`https://dummyjson.com/products/search?q=${text}`);
        const data = await res.json();

        if (data.total === 0) {
            showCatalog();
            setActive(btnInicio);
            return;
        }

        quantity.textContent = data.total;
        resultTitle.textContent = `Resultados para "${text}"`;
        renderSearchCards(data.products);
        showResults();
    }

    // ── Inicio ───────────────────────────────────────────────────────
    function goHome() {
        setActive(btnInicio);
        showCatalog();
        getProducts();
    }

    siteLogo.addEventListener('click', goHome);
    btnInicio.addEventListener('click', goHome);

    formSearch.addEventListener('submit', function (e) {
        e.preventDefault();
        const text = this.querySelector('input').value.trim();
        if (!text) return;
        searchProducts(text);
        this.querySelector('input').value = '';
    });

    // ── Arrancar ─────────────────────────────────────────────────────
    loadCategories();
    getProducts();
});


//// CLASES Y MODULADIRAD


// // // async function getPopularNow(){
// // //     const billboard = document.getElementById('billboard');

// // //     const response = await fetch('https://api.themoviedb.org/3/movie/now_playing?language=en-US&sort_by=primary_release_date.desc', {
// // //         headers: {
// // //             Authorization: `Bearer ${token}`
// // //         }
// // //     });

// // //     const data = await response.json();

// // //     console.log(data);

    
// // //     for(let movie of data.results){
// // //         const {original_title, poster_path, release_date} = movie;

// // //         billboard.innerHTML += `<div class="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
// // //         <div class="h-100 bg-zinc-800">
// // //             <img src="https://image.tmdb.org/t/p/w500${poster_path}">
// // //         </div>

// // //         <div class="p-4">
// // //           <h3 class="font-semibold">
// // //             ${original_title}
// // //           </h3>

// // //           <p class="text-sm text-zinc-400 mt-1">
// // //             ${release_date}
// // //           </p>
// // //         </div>
// // //       </div>`;
// // //     }

// // // }

// // // getPopularNow();


// const formSearch = document.getElementById('frm-search');

// // API Key - https://www.themoviedb.org/
// const token = ``;

// formSearch.addEventListener('submit', function(event) {
//     event.preventDefault();

//     const searchText = this.querySelector('input').value;

//     if(searchText.trim().length === 0){
//         return;
//     }

//     searchMovies(searchText);

//     this.querySelector('input').value = '';
// });

// async function searchMovies(text){

//     const searchResults = document.getElementById('search-results');
//     const quantity = document.getElementById('quantity');

//     const response = await fetch(`https://api.themoviedb.org/3/search/movie?query=${text}&include_adult=false&language=en-US`, {
//         headers: {
//             Authorization: `Bearer ${token}`
//         }
//     });
//     const data = await response.json();

//     quantity.textContent = data.total_results;

//     searchResults.innerHTML = '';

//     for(let movie of data.results){

//         const {original_title, poster_path, vote_average} = movie;

//         searchResults.innerHTML += `<div class="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
//                 <div class="h-100 bg-zinc-800">
//                     <img src="https://image.tmdb.org/t/p/w500${poster_path}" alt="${original_title}">
//                 </div>

//                 <div class="p-4">
//                     <div class="flex items-center justify-between">
//                         <h3 class="font-semibold">
//                             ${original_title}
//                         </h3>

//                         <span class="text-yellow-400 text-sm">
//                             ★ ${vote_average}
//                         </span>
//                     </div>
//                 </div>
//             </div>`;
//     }
// }
