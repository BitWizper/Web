// Mover estas funciones fuera del DOMContentLoaded para hacerlas globales
window.actualizarCantidad = function(index, cambio) {
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    
    if (carrito[index]) {
        carrito[index].cantidad += cambio;
        
        if (carrito[index].cantidad <= 0) {
            carrito.splice(index, 1);
        }
        
        localStorage.setItem('carrito', JSON.stringify(carrito));
        mostrarProductosCarrito();
        updateCounts();
        renderCartPopup();
    }
};

window.eliminarProducto = function(index) {
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    carrito.splice(index, 1);
    localStorage.setItem('carrito', JSON.stringify(carrito));
    mostrarProductosCarrito();
    updateCounts();
    renderCartPopup();
    addNotification('Producto eliminado del carrito');
};

document.addEventListener('DOMContentLoaded', async function() {
    // Elementos del DOM
    const cartIcon = document.querySelector('.fa-shopping-cart').parentElement;
    const notificationIcon = document.querySelector('.fa-bell').parentElement;
    const cartPopup = document.createElement('div');
    const notificationPopup = document.createElement('div');
    
    // Configurar popups
    cartPopup.className = 'popup-container';
    notificationPopup.className = 'popup-container';
    
    // Inicializar datos
    let cart = JSON.parse(localStorage.getItem('carrito')) || [];
    let notifications = JSON.parse(localStorage.getItem('notifications')) || [];
    
    // Configurar contadores
    const cartCount = document.createElement('span');
    const notificationCount = document.createElement('span');
    cartCount.className = 'item-count';
    notificationCount.className = 'item-count';
    cartIcon.style.position = 'relative';
    notificationIcon.style.position = 'relative';
    cartIcon.appendChild(cartCount);
    notificationIcon.appendChild(notificationCount);

    // Actualizar contadores
    function updateCounts() {
        const totalItems = cart.reduce((sum, item) => sum + item.cantidad, 0);
        cartCount.textContent = totalItems;
        cartCount.style.display = totalItems > 0 ? 'flex' : 'none';

        notificationCount.textContent = notifications.length;
        notificationCount.style.display = notifications.length > 0 ? 'flex' : 'none';
    }

    // Renderizar carrito popup con datos de la API
    async function renderCartPopup() {
        try {
            const response = await fetch('http://localhost:3000/api/pastel/obtenerpasteles');
            const pasteles = await response.json();

            const cartItemsWithDetails = cart.map(cartItem => {
                const pastelInfo = pasteles.find(p => p.id_pastel === cartItem.id);
                return {
                    ...cartItem,
                    nombre: pastelInfo?.nombre || cartItem.nombre,
                    precio: pastelInfo?.precio || cartItem.precio,
                    imagen: pastelInfo?.imagen_url || cartItem.imagen
                };
            });

            let total = cartItemsWithDetails.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
            
            cartPopup.innerHTML = `
                <h3>Carrito de Compras</h3>
                <div class="popup-items">
                    ${cartItemsWithDetails.map((item, index) => `
                        <div class="popup-item">
                            <img src="${item.imagen}" alt="${item.nombre}" 
                                 onerror="this.src='../img/repostera1.jpg'">
                            <div class="popup-item-details">
                                <h4>${item.nombre}</h4>
                                <p>$${item.precio} x ${item.cantidad}</p>
                                <button onclick="removeFromCart(${index})" class="remove-item">&times;</button>
                            </div>
                        </div>
                    `).join('')}
                </div>
                <div class="popup-footer">
                    <p>Total: $${total.toFixed(2)}</p>
                    <a href="carrito.html" class="popup-btn">Ver Carrito</a>
                </div>
            `;
        } catch (error) {
            console.error('Error al cargar los pasteles:', error);
            cartPopup.innerHTML = `
                <h3>Carrito de Compras</h3>
                <p>Error al cargar los productos</p>
            `;
        }
    }

    // Renderizar notificaciones popup
    function renderNotificationPopup() {
        notificationPopup.innerHTML = `
            <h3>Notificaciones</h3>
            <div class="popup-items">
                ${notifications.map(notif => `
                    <div class="notification-item">
                        <p>${notif.message}</p>
                        <div class="time">${notif.time}</div>
                    </div>
                `).join('')}
            </div>
            <div class="popup-footer">
                <a href="notificaciones.html" class="popup-btn">Ver Notificaciones</a>
            </div>
        `;
    }

    // Añadir notificación
    function addNotification(message) {
        const notification = {
            message,
            time: new Date().toLocaleString()
        };
        notifications.unshift(notification);
        if (notifications.length > 5) notifications.pop();
        localStorage.setItem('notifications', JSON.stringify(notifications));
        updateCounts();
        renderNotificationPopup();
        
        // Mostrar notificación temporal
        const notif = document.createElement('div');
        notif.className = 'notification';
        notif.textContent = message;
        document.body.appendChild(notif);
        setTimeout(() => {
            notif.classList.add('show');
        }, 100);
        setTimeout(() => {
            notif.classList.remove('show');
            setTimeout(() => notif.remove(), 300);
        }, 3000);
    }

    // Añadir al carrito
    window.addToCart = async function(pastel) {
        const existingItem = cart.find(item => item.id === pastel.id);
        
        if (existingItem) {
            existingItem.cantidad += 1;
        } else {
            cart.push({
                id: pastel.id,
                nombre: pastel.nombre,
                precio: pastel.precio,
                imagen: pastel.imagen,
                cantidad: 1
            });
        }

        localStorage.setItem('carrito', JSON.stringify(cart));
        updateCounts(); // Actualiza el contador inmediatamente
        await renderCartPopup(); // Actualiza el popup del carrito inmediatamente
        addNotification(`Se añadió ${pastel.nombre} al carrito`);
    };
    
    

    // Remover del carrito
    window.removeFromCart = function(index) {
        const item = cart[index];
        cart.splice(index, 1);
        localStorage.setItem('carrito', JSON.stringify(cart));
        updateCounts();
        renderCartPopup();
        addNotification(`Se eliminó ${item.nombre} del carrito`);
    };

    // Event Listeners
    cartIcon.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        notificationPopup.classList.remove('show');
        cartPopup.classList.toggle('show');
    });

    notificationIcon.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        cartPopup.classList.remove('show');
        notificationPopup.classList.toggle('show');
    });

    document.addEventListener('click', function(e) {
        if (!cartPopup.contains(e.target) && !cartIcon.contains(e.target)) {
            cartPopup.classList.remove('show');
        }
        if (!notificationPopup.contains(e.target) && !notificationIcon.contains(e.target)) {
            notificationPopup.classList.remove('show');
        }
    });

    // Mostrar productos en la página del carrito
    async function mostrarProductosCarrito() {
        const carritoItems = document.querySelector('.carrito-items');
        if (!carritoItems) return;

        if (cart.length === 0) {
            carritoItems.innerHTML = `
                <div class="carrito-vacio">
                    <i class="fas fa-shopping-cart" style="font-size: 48px; color: #ccc;"></i>
                    <p>Tu carrito está vacío</p>
                    <a href="categorias.html" class="btn">Ver pasteles</a>
                </div>
            `;
            actualizarResumen(0);
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/api/pastel/obtenerpasteles');
            const pasteles = await response.json();

            const cartItemsWithDetails = cart.map(cartItem => {
                const pastelInfo = pasteles.find(p => p.id_pastel === cartItem.id);
                return {
                    ...cartItem,
                    nombre: pastelInfo?.nombre || cartItem.nombre,
                    precio: pastelInfo?.precio || cartItem.precio,
                    imagen: pastelInfo?.imagen_url || cartItem.imagen
                };
            });

            carritoItems.innerHTML = cartItemsWithDetails.map((item, index) => `
                <div class="carrito-item">
                    <img src="${item.imagen}" 
                         alt="${item.nombre}"
                         onerror="this.src='../img/repostera1.jpg'">
                    <div class="carrito-item-details">
                        <h4>${item.nombre}</h4>
                        <p class="carrito-item-price">$${parseFloat(item.precio).toFixed(2)}</p>
                    </div>
                    <div class="carrito-item-quantity">
                        <button onclick="actualizarCantidad(${index}, -1)" class="btn-cantidad">
                            <i class="fas fa-minus"></i>
                        </button>
                        <span>${item.cantidad}</span>
                        <button onclick="actualizarCantidad(${index}, 1)" class="btn-cantidad">
                            <i class="fas fa-plus"></i>
                        </button>
                        <button onclick="eliminarProducto(${index})" class="btn-eliminar">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `).join('');

            actualizarResumen(cartItemsWithDetails);
        } catch (error) {
            console.error('Error al cargar los pasteles:', error);
            carritoItems.innerHTML = `
                <div class="error-message">
                    <p>Error al cargar los productos del carrito</p>
                </div>
            `;
        }
    }

    // Función para actualizar el resumen del pedido
    function actualizarResumen(carrito) {
        if (!Array.isArray(carrito)) return;
        
        const subtotal = carrito.reduce((sum, item) => sum + (parseFloat(item.precio) * item.cantidad), 0);
        const iva = subtotal * 0.16;
        const total = subtotal + iva;

        document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
        document.getElementById('iva').textContent = `$${iva.toFixed(2)}`;
        document.getElementById('total').textContent = `$${total.toFixed(2)}`;
    }

    // Función para proceder al pago
    function procederPago() {
        const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
        if (carrito.length === 0) {
            alert('Tu carrito está vacío');
            return;
        }
        // Aquí puedes agregar la lógica para el proceso de pago
        alert('Procediendo al pago...');
    }

    // Inicialización
    cartIcon.parentElement.appendChild(cartPopup);
    notificationIcon.parentElement.appendChild(notificationPopup);
    updateCounts();
    await renderCartPopup();
    renderNotificationPopup();

    // Inicializar la página del carrito si estamos en ella
    if (document.querySelector('.carrito-container')) {
        mostrarProductosCarrito();
    }
});
