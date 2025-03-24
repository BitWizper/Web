// Función para manejar la barra de navegación
let navbar = document.querySelector('.navbar');

document.querySelector('#menu').onclick = () => {
    navbar.classList.toggle('active');
}

window.onscroll = () => {
    navbar.classList.remove('active');
}

// Función para agregar productos a favoritos
function addToFavorites(productName, productImage) {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || []; // Obtener favoritos existentes
    const product = { name: productName, image: productImage };

    // Verificar si el producto ya está en favoritos
    if (!favorites.some(fav => fav.name === productName)) {
        favorites.push(product); // Agregar nuevo producto
        localStorage.setItem('favorites', JSON.stringify(favorites)); // Guardar de nuevo en localStorage
    }
}

