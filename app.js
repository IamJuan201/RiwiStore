document.addEventListener('DOMContentLoaded', function () {
    const formSearch   = document.getElementById('frm-search');
    const catalog      = document.getElementById('Catalog');
    const searchResults = document.getElementById('search-results');
    const quantity     = document.getElementById('quantity');
    const catalogSection = document.getElementById('catalog-section');
    const catalogTitle   = document.getElementById('catalog-title');

    // Cargar todos los productos al inicio
    getProducts();

    async function getProducts() {
        const response = await fetch('https://dummyjson.com/products');
        const data = await response.json();

        catalog.innerHTML = '';

        for (let product of data.products) {
            const { title, description, price, images, availabilityStatus } = product;

            catalog.innerHTML += `
            <div class="card">
                <div class="card-img-wrapper">
                    <img src="${images[0]}" alt="${title}" />
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

    // Buscar productos
    async function searchProducts(text) {
        const response = await fetch(`https://dummyjson.com/products/search?q=${text}`);
        const data = await response.json();

        quantity.textContent = data.total;
        searchResults.innerHTML = '';

        if (data.products.length === 0) {
            searchResults.innerHTML = '<p class="no-results">No se encontraron productos.</p>';
            return;
        }

        for (let product of data.products) {
            const { title, images, rating } = product;

            searchResults.innerHTML += `
            <div class="card">
                <div class="card-img-wrapper">
                    <img src="${images[0]}" alt="${title}" />
                </div>
                <div class="card-body">
                    <div class="card-header-row">
                        <h3 class="card-title">${title}</h3>
                        <span class="card-rating">★ ${rating}</span>
                    </div>
                </div>
            </div>`;
        }

        // Ocultar catálogo principal al buscar
        if (catalogSection) catalogSection.style.display = 'none';
        if (catalogTitle)   catalogTitle.style.display   = 'none';
    }

    // Evento submit del buscador
    formSearch.addEventListener('submit', function (event) {
        event.preventDefault();
        const searchText = this.querySelector('input').value.trim();
        if (searchText.length === 0) return;
        searchProducts(searchText);
        this.querySelector('input').value = '';
    });
});   

//// TERMINAR PAGINACION
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
