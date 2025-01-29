// Inicializar carrito en localStorage si no existe
if (!localStorage.getItem('carrito')) {
    localStorage.setItem('carrito', JSON.stringify([]));
}

// Función para añadir un producto al carrito
function agregarAlCarrito(pastel) {
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];

    // Verificar si el producto ya está en el carrito
    const existente = carrito.find(item => item.id === pastel.id);

    if (existente) {
        existente.cantidad += 1; // Incrementar cantidad si ya existe
    } else {
        carrito.push({ ...pastel, cantidad: 1 }); // Agregar nuevo producto
    }

    localStorage.setItem('carrito', JSON.stringify(carrito));
    alert('Producto añadido al carrito');
}

// Función para mostrar los pasteles en el HTML (con funcionalidad de carrito)
function mostrarPasteles(pasteles, containerSelector) {
    const container = document.querySelector(containerSelector);
    container.innerHTML = ''; // Limpiar el contenedor

    pasteles.forEach(pastel => {
        const pastelElemento = document.createElement('div');
        pastelElemento.classList.add('box');

        pastelElemento.innerHTML = `
            <div class="image">
                <img src="${pastel.imagen_url}" alt="${pastel.nombre}">
            </div>
            <div class="content">
                <h3>${pastel.nombre}</h3>
                <p>${pastel.descripcion}</p>
                <div class="price">$${pastel.precio} MXN</div>
                <div class="stars">
                    ${getStarsHTML(pastel.popularidad)}
                </div>
                <a href="#" class="btn">add to cart</a>
            </div>
        `;

        // Añadir funcionalidad al botón "Add to Cart"
        pastelElemento.querySelector('.btn').addEventListener('click', (event) => {
            event.preventDefault(); // Prevenir comportamiento por defecto del enlace
            agregarAlCarrito({
                id: pastel.id,
                nombre: pastel.nombre,
                descripcion: pastel.descripcion,
                precio: pastel.precio,
                imagen_url: pastel.imagen_url,
                popularidad: pastel.popularidad
            });
        });

        container.appendChild(pastelElemento);
    });
}

// Helper function para generar estrellas de popularidad
function getStarsHTML(popularidad) {
    const fullStars = Math.floor(popularidad);
    const halfStar = popularidad % 1 !== 0;
    console.log(`estrella completa: ${fullStars}`);
    console.log(`media estrella: ${halfStar}`);
    const emptyStars = (5 - fullStars - (halfStar ? 1 : 0)) >= 0? (5 - fullStars - (halfStar ? 1 : 0)) : 0 ;
    
    return (
        '<i class="fas fa-star"></i>'.repeat(fullStars) +
        (halfStar ? '<i class="fas fa-star-half-alt"></i>' : '') +
        '<i class="far fa-star"></i>'.repeat(emptyStars)
    );
}

// Funciones existentes para mostrar pasteles
async function mostrarDestacados() {
    try {
        const response = await fetch('https://pateles-borcelle.onrender.com/api/pastel/obtenerpasteles');
        const pasteles = await response.json();
        
        const destacados = pasteles.filter(pastel => pastel.popularidad >= 4.2);
        mostrarPasteles(destacados, '.menu .box-container');
    } catch (error) {
        console.error('Error al obtener los pasteles destacados:', error);
    }
}

async function mostrarNovedades() {
    try {
        const response = await fetch('https://pateles-borcelle.onrender.com/api/pastel/obtenerpasteles');
        const pasteles = await response.json();
        
        const novedades = pasteles.filter(pastel => pastel.popularidad <= 4.0);
        mostrarPasteles(novedades, '.menu .box-container');
    } catch (error) {
        console.error('Error al obtener los pasteles de novedades:', error);
    }
}

async function mostrarRecomendados() {
    try {
        const response = await fetch('https://pateles-borcelle.onrender.com/api/pastel/obtenerpasteles');
        const pasteles = await response.json();
        
        const recomendados = pasteles.sort((a, b) => b.popularidad - a.popularidad);
        mostrarPasteles(recomendados, '.menu .box-container');
    } catch (error) {
        console.error('Error al obtener los pasteles recomendados:', error);
    }
}

// Event listener para cargar pasteles recomendados por defecto al cargar la página
document.addEventListener('DOMContentLoaded', mostrarRecomendados);
