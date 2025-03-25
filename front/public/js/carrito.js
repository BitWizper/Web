document.addEventListener('DOMContentLoaded', function() {
    // Elementos del DOM
    const cartIcon = document.querySelector('.fa-shopping-cart').parentElement;
    const notificationIcon = document.querySelector('.fa-bell').parentElement;
    const cartPopup = document.createElement('div');
    const notificationPopup = document.createElement('div');
    
    // Configurar popups
    cartPopup.className = 'popup-container';
    notificationPopup.className = 'popup-container';
    
    // Inicializar datos
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
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
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
        cartCount.style.display = totalItems > 0 ? 'flex' : 'none';

        notificationCount.textContent = notifications.length;
        notificationCount.style.display = notifications.length > 0 ? 'flex' : 'none';
    }

    // Renderizar carrito popup
    function renderCartPopup() {
        let total = cart.reduce((sum, item) => sum + (item.precio * item.quantity), 0);
        cartPopup.innerHTML = `
            <h3>Carrito de Compras</h3>
            <div class="popup-items">
                ${cart.map((item, index) => `
                    <div class="popup-item">
                        <img src="${item.imagen}" alt="${item.nombre}">
                        <div class="popup-item-details">
                            <h4>${item.nombre}</h4>
                            <p>$${item.precio} x ${item.quantity}</p>
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
    window.addToCart = function(pastel) {
        const existingItem = cart.find(item => item.id === pastel.id);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                id: pastel.id,
                nombre: pastel.nombre,
                precio: pastel.precio,
                imagen: pastel.imagen_url,
                quantity: 1
            });
        }

        localStorage.setItem('cart', JSON.stringify(cart));
        updateCounts();
        renderCartPopup();
        addNotification(`Se añadió ${pastel.nombre} al carrito`);
    };

    // Remover del carrito
    window.removeFromCart = function(index) {
        const item = cart[index];
        cart.splice(index, 1);
        localStorage.setItem('cart', JSON.stringify(cart));
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

    // Inicialización
    cartIcon.parentElement.appendChild(cartPopup);
    notificationIcon.parentElement.appendChild(notificationPopup);
    updateCounts();
    renderCartPopup();
    renderNotificationPopup();

    // Función para mostrar los productos en la página del carrito
    function mostrarProductosCarrito() {
        const carritoItems = document.querySelector('.carrito-items');
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        
        if (cart.length === 0) {
            carritoItems.innerHTML = '<p class="carrito-vacio">Tu carrito está vacío</p>';
            actualizarResumen(0);
            return;
        }

        carritoItems.innerHTML = cart.map((item, index) => `
            <div class="carrito-item">
                <img src="${item.imagen}" alt="${item.nombre}">
                <div class="carrito-item-details">
                    <h4>${item.nombre}</h4>
                    <p class="carrito-item-price">$${item.precio.toFixed(2)}</p>
                </div>
                <div class="carrito-item-quantity">
                    <button onclick="actualizarCantidad(${index}, -1)">-</button>
                    <span>${item.quantity}</span>
                    <button onclick="actualizarCantidad(${index}, 1)">+</button>
                    <button onclick="eliminarProducto(${index})" class="remove-item">&times;</button>
                </div>
            </div>
        `).join('');

        actualizarResumen(cart);
    }

    // Función para actualizar la cantidad de un producto
    function actualizarCantidad(index, cambio) {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        
        if (cart[index]) {
            cart[index].quantity += cambio;
            
            if (cart[index].quantity <= 0) {
                cart.splice(index, 1);
            }
            
            localStorage.setItem('cart', JSON.stringify(cart));
            mostrarProductosCarrito();
            updateCounts();
            renderCartPopup();
        }
    }

    // Función para eliminar un producto del carrito
    function eliminarProducto(index) {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        cart.splice(index, 1);
        localStorage.setItem('cart', JSON.stringify(cart));
        mostrarProductosCarrito();
        updateCounts();
        renderCartPopup();
        addNotification('Producto eliminado del carrito');
    }

    // Función para actualizar el resumen del pedido
    function actualizarResumen(cart) {
        const subtotal = cart.reduce((sum, item) => sum + (item.precio * item.quantity), 0);
        const iva = subtotal * 0.16;
        const total = subtotal + iva;

        document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
        document.getElementById('iva').textContent = `$${iva.toFixed(2)}`;
        document.getElementById('total').textContent = `$${total.toFixed(2)}`;
    }

    // Función para proceder al pago
    function procederPago() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        if (cart.length === 0) {
            alert('Tu carrito está vacío');
            return;
        }
        alert('Procediendo al pago...');
        // Aquí puedes agregar la lógica para el proceso de pago
    }

    // Inicializar la página del carrito
    if (document.querySelector('.carrito-container')) {
        mostrarProductosCarrito();
    }
});
