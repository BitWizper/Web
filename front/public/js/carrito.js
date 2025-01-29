// URL base del servidor
const API_URL = 'http://localhost:3000/api/pastel'; // Cambia al puerto donde esté corriendo tu servidor

// Función para cargar los pasteles disponibles desde el servidor
async function cargarPasteles() {
    try {
        const response = await fetch(`${API_URL}/obtenerpasteles`);
        const pasteles = await response.json();

        // Mostrar el catálogo de pasteles (esto puede ser usado para una página de catálogo)
        mostrarCatalogo(pasteles);
    } catch (error) {
        console.error('Error al cargar pasteles:', error);
    }
}

// Mostrar catálogo de pasteles en la página (esto es opcional según diseño)
function mostrarCatalogo(pasteles) {
    const catalogoContainer = document.querySelector('.carrito-container'); // Cambia el selector según tu HTML
    catalogoContainer.innerHTML = '';

    pasteles.forEach(pastel => {
        const pastelElement = document.createElement('div');
        pastelElement.classList.add('carrito-item');

        pastelElement.innerHTML = `
            <div class="image">
                <img src="${pastel.imagen}" alt="${pastel.nombre}">
            </div>
            <div class="content">
                <h3>${pastel.nombre}</h3>
                <p>${pastel.descripcion}</p>
                <div class="price">$${pastel.precio} MXN</div>
                <div class="cantidad">
                    <button class="btn cantidad-btn" data-id="${pastel.id}" data-action="decrement">-</button>
                    <span class="cantidad-num">1</span>
                    <button class="btn cantidad-btn" data-id="${pastel.id}" data-action="increment">+</button>
                </div>
                <button class="btn add-to-cart-btn" data-id="${pastel.id}">Agregar al carrito</button>
            </div>
        `;

        catalogoContainer.appendChild(pastelElement);
    });

    // Event listeners para botones "Agregar al carrito"
    document.querySelectorAll('.add-to-cart-btn').forEach(button => {
        button.addEventListener('click', () => {
            agregarAlCarrito(button.dataset.id);
        });
    });
}

// Función para agregar un pastel al carrito
async function agregarAlCarrito(id) {
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];

    // Verificar si el pastel ya está en el carrito
    const pastelExistente = carrito.find(item => item.id === id);

    if (pastelExistente) {
        pastelExistente.cantidad++;
    } else {
        // Obtener detalles del pastel desde el servidor
        try {
            const response = await fetch(`${API_URL}/pasteles/${id}`);
            const pastel = await response.json();

            carrito.push({
                id: pastel.id,
                nombre: pastel.nombre,
                descripcion: pastel.descripcion,
                imagen: pastel.imagen,
                precio: pastel.precio,
                cantidad: 1,
            });
        } catch (error) {
            console.error('Error al agregar pastel al carrito:', error);
            return;
        }
    }

    // Guardar el carrito actualizado en localStorage
    localStorage.setItem('carrito', JSON.stringify(carrito));

    // Actualizar la interfaz
    cargarCarrito();
}

// Función para cargar el carrito desde localStorage
function cargarCarrito() {
    const carritoContainer = document.querySelector('.carrito-container');
    carritoContainer.innerHTML = '';

    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];

    if (carrito.length === 0) {
        carritoContainer.innerHTML = '<p>Tu carrito está vacío.</p>';
        return;
    }

    carrito.forEach(producto => {
        const productElement = document.createElement('div');
        productElement.classList.add('carrito-item');

        productElement.innerHTML = `
            <div class="image">
                <img src="${producto.imagen}" alt="${producto.nombre}">
            </div>
            <div class="content">
                <h3>${producto.nombre}</h3>
                <p>${producto.descripcion}</p>
                <div class="price">$${producto.precio} MXN</div>
                <div class="cantidad">
                    <button class="btn cantidad-btn" data-id="${producto.id}" data-action="decrement">-</button>
                    <span class="cantidad-num">${producto.cantidad}</span>
                    <button class="btn cantidad-btn" data-id="${producto.id}" data-action="increment">+</button>
                </div>
                <button class="btn remove-btn" data-id="${producto.id}">Eliminar</button>
            </div>
        `;

        carritoContainer.appendChild(productElement);
    });

    // Event listeners para botones de cantidad
    document.querySelectorAll('.cantidad-btn').forEach(button => {
        button.addEventListener('click', () => {
            actualizarCantidad(button.dataset.id, button.dataset.action);
        });
    });

    // Event listeners para botones "Eliminar"
    document.querySelectorAll('.remove-btn').forEach(button => {
        button.addEventListener('click', () => {
            eliminarDelCarrito(button.dataset.id);
        });
    });
}

// Función para actualizar la cantidad de un pastel en el carrito
function actualizarCantidad(id, action) {
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    const producto = carrito.find(item => item.id === id);

    if (producto) {
        if (action === 'increment') {
            producto.cantidad++;
        } else if (action === 'decrement' && producto.cantidad > 1) {
            producto.cantidad--;
        }
    }

    localStorage.setItem('carrito', JSON.stringify(carrito));
    cargarCarrito();
}

// Función para eliminar un pastel del carrito
function eliminarDelCarrito(id) {
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    carrito = carrito.filter(producto => producto.id !== id);

    localStorage.setItem('carrito', JSON.stringify(carrito));
    cargarCarrito();
}

// Inicializar la página cargando los pasteles y el carrito
document.addEventListener('DOMContentLoaded', () => {
    cargarPasteles();
    cargarCarrito();
});
