// Selecciona el contenedor para los reposteros populares
const reposterosContainer = document.querySelector('.reposteros-container');

// Función para renderizar los datos de los reposteros en el DOM
const renderReposteros = (reposteros) => {
    if (!Array.isArray(reposteros)) {
        console.error('Los datos de reposteros no son válidos:', reposteros);
        return;
    }

    reposterosContainer.innerHTML = ''; // Limpia el contenedor antes de renderizar
    reposteros.forEach(repostero => {
        const div = document.createElement('div');
        div.classList.add('repostero'); // Clase CSS para estilos
        div.innerHTML = `
            <h3>${repostero.NombreNegocio}</h3>
            <p><strong>Ubicación:</strong> ${repostero.Ubicacion || 'No especificada'}</p>
            <p><strong>Especialidades:</strong> ${repostero.Especialidades || 'No especificadas'}</p>
            ${repostero.PortafolioURL 
                ? `<a href="${repostero.PortafolioURL}" target="_blank">Ver Portafolio</a>` 
                : '<p>Portafolio no disponible</p>'}
        `;
        reposterosContainer.appendChild(div); // Agrega el elemento al contenedor
    });
};

// URL de la API que devuelve los datos de los reposteros
const API_URL = 'https://pateles-borcelle.onrender.com/api/repostero/obtenereposteros'; // Cambia esta URL por la correcta de tu backend

// Función para obtener los datos de los reposteros desde la API
const fetchData = async () => {
    try {
        const response = await fetch(API_URL); // Realiza la solicitud a la API
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const reposteros = await response.json(); // Convierte la respuesta a JSON
        console.log('Datos obtenidos:', reposteros); // Debugging: Imprime los datos en la consola
        renderReposteros(reposteros); // Renderiza los datos obtenidos
    } catch (error) {
        console.error('Error al obtener los datos:', error);
        reposterosContainer.innerHTML = '<p>Error al cargar los reposteros. Intenta más tarde.</p>';
    }
};


// Obtener y mostrar pasteles destacados
async function mostrarDestacados() {
    try {
        const response = await fetch('https://pateles-borcelle.onrender.com/api/pastel/obtenerpasteles');
        const pasteles = await response.json();

        // Filtrar pasteles destacados
        const destacados = pasteles.filter(pastel => pastel.popularidad >= 4.2);
        
        // Renderizar pasteles
        mostrarPasteles(destacados, '#destacados');
    } catch (error) {
        console.error('Error al obtener los pasteles destacados:', error);
    }
}

// Función para renderizar los pasteles en el contenedor
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
                <div class="price">$${pastel.precio.toFixed(2)} MXN</div>
                <div class="stars">
                    ${getStarsHTML(pastel.popularidad)}
                </div>
                <a href="#" class="btn">add to cart</a>
            </div>
        `;

        container.appendChild(pastelElemento);
    });
}

// Función para generar estrellas según popularidad
function getStarsHTML(popularidad) {
    const fullStars = Math.floor(popularidad);
    const halfStar = popularidad % 1 !== 0;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

    return (
        '<i class="fas fa-star"></i>'.repeat(fullStars) +
        (halfStar ? '<i class="fas fa-star-half-alt"></i>' : '') +
        '<i class="far fa-star"></i>'.repeat(emptyStars)
    );
}

// Cargar pasteles destacados al cargar la página
document.addEventListener('DOMContentLoaded', mostrarDestacados);



// Llama a la función para cargar los datos al cargar la página
document.addEventListener('DOMContentLoaded', fetchData);
