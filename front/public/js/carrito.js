// Mover estas funciones fuera del DOMContentLoaded para hacerlas globales
window.actualizarCantidad = function(index, cambio) {
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    
    if (carrito[index]) {
        const nuevaCantidad = carrito[index].cantidad + cambio;
        if (nuevaCantidad >= 1) {
            carrito[index].cantidad = nuevaCantidad;
            localStorage.setItem('carrito', JSON.stringify(carrito));
            mostrarProductosCarrito();
            actualizarResumen(carrito);
            mostrarNotificacion(cambio > 0 ? 'Cantidad aumentada' : 'Cantidad reducida');
        } else if (nuevaCantidad === 0) {
            eliminarProducto(index);
        }
    }
};

window.eliminarProducto = function(index) {
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    const productoEliminado = carrito[index];
    
    if (productoEliminado) {
        carrito.splice(index, 1);
        localStorage.setItem('carrito', JSON.stringify(carrito));
        mostrarProductosCarrito();
        actualizarResumen(carrito);
        mostrarNotificacion(`${productoEliminado.nombre} eliminado del carrito`);
    }
};

// Agregar la función procederPago al ámbito global
window.procederPago = async function() {
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    if (carrito.length === 0) {
        alert('Tu carrito está vacío');
        return;
    }

    // Verificar si ya existe un seguimiento de pago
    const seguimientoExistente = document.querySelector('.seguimiento-pago');
    if (seguimientoExistente) {
        seguimientoExistente.remove();
    }

    // Calcular el total
    const subtotal = carrito.reduce((sum, item) => sum + (parseFloat(item.precio) * item.cantidad), 0);
    const iva = subtotal * 0.16;
    const total = subtotal + iva;

    // Obtener tarjetas guardadas del localStorage
    const tarjetasGuardadas = JSON.parse(localStorage.getItem('tarjetasGuardadas')) || [];

    // Crear el elemento de seguimiento con selección de método de pago
    const seguimientoPago = document.createElement('div');
    seguimientoPago.className = 'seguimiento-pago';
    seguimientoPago.innerHTML = `
        <h4>Método de Pago</h4>
        <div class="metodos-pago">
            <div class="metodo-pago-option">
                <input type="radio" id="tarjeta" name="metodoPago" value="tarjeta">
                <label for="tarjeta">
                    <i class="fas fa-credit-card"></i> Tarjeta de Crédito/Débito
                </label>
                <div class="tarjeta-details" style="display: none; margin-top: 15px;">
                    ${tarjetasGuardadas.length > 0 ? `
                        <div class="tarjetas-guardadas">
                            <h5>Tarjetas guardadas:</h5>
                            ${tarjetasGuardadas.map((tarjeta, index) => `
                                <div class="tarjeta-guardada">
                                    <input type="radio" name="tarjetaGuardada" id="tarjeta${index}" value="${index}">
                                    <label for="tarjeta${index}">
                                        <i class="fas fa-credit-card"></i>
                                        **** **** **** ${tarjeta.numero.slice(-4)}
                                    </label>
                                </div>
                            `).join('')}
                            <button type="button" class="btn-nueva-tarjeta" onclick="mostrarFormularioTarjeta()">
                                <i class="fas fa-plus"></i> Usar nueva tarjeta
                            </button>
                        </div>
                    ` : ''}
                    <form id="formTarjeta" class="form-tarjeta" style="display: ${tarjetasGuardadas.length > 0 ? 'none' : 'block'}">
                        <div class="form-group">
                            <input type="text" placeholder="Número de tarjeta" maxlength="16" required>
                        </div>
                        <div class="form-row">
                            <input type="text" placeholder="MM/AA" maxlength="5" required>
                            <input type="text" placeholder="CVV" maxlength="3" required>
                        </div>
                        <div class="form-group">
                            <input type="text" placeholder="Nombre en la tarjeta" required>
                        </div>
                        <div class="form-check">
                            <input type="checkbox" id="guardarTarjeta">
                            <label for="guardarTarjeta">Guardar tarjeta para futuras compras</label>
                        </div>
                    </form>
                </div>
            </div>
            <div class="metodo-pago-option">
                <input type="radio" id="efectivo" name="metodoPago" value="efectivo">
                <label for="efectivo">
                    <i class="fas fa-money-bill-wave"></i> Pago en Efectivo
                </label>
                <div class="efectivo-details" style="display: none; margin-top: 15px;">
                    <p>Podrás pagar en efectivo al momento de la entrega.</p>
                    <p>Total a pagar: $${total.toFixed(2)}</p>
                </div>
            </div>
            <div class="metodo-pago-option">
                <input type="radio" id="transferencia" name="metodoPago" value="transferencia">
                <label for="transferencia">
                    <i class="fas fa-exchange-alt"></i> Transferencia Bancaria
                </label>
                <div class="transferencia-details" style="display: none; margin-top: 15px;">
                    <p>Realiza la transferencia a la siguiente cuenta:</p>
                    <div class="datos-transferencia">
                        <p><strong>Banco:</strong> Bancomer</p>
                        <p><strong>Cuenta:</strong> 0123456789</p>
                        <p><strong>CLABE:</strong> 012345678901234567</p>
                        <p><strong>Beneficiario:</strong> Borcelle Pastelería</p>
                        <p><strong>Monto:</strong> $${total.toFixed(2)}</p>
                    </div>
                </div>
            </div>
        </div>
        <button class="btn-confirmar-pago" onclick="confirmarPago()" style="display: none;">
            Confirmar Pago
        </button>
        <div class="estado-pago" style="display: none;">
            <div class="estado-actual"></div>
            <div class="historial-pago"></div>
        </div>
    `;

    // Insertar el seguimiento después del botón de pago
    const botonPago = document.querySelector('button[onclick="procederPago()"]');
    botonPago.parentNode.insertBefore(seguimientoPago, botonPago.nextSibling);
    botonPago.style.display = 'none';

    // Mostrar detalles según el método seleccionado
    const radioButtons = seguimientoPago.querySelectorAll('input[name="metodoPago"]');
    radioButtons.forEach(radio => {
        radio.addEventListener('change', () => {
            // Ocultar todos los detalles
            seguimientoPago.querySelectorAll('.tarjeta-details, .efectivo-details, .transferencia-details').forEach(detail => {
                detail.style.display = 'none';
            });
            
            // Mostrar los detalles del método seleccionado
            const details = seguimientoPago.querySelector(`.${radio.value}-details`);
            if (details) {
                details.style.display = 'block';
            }
            
            seguimientoPago.querySelector('.btn-confirmar-pago').style.display = 'block';
        });
    });
};

window.mostrarFormularioTarjeta = function() {
    const tarjetasGuardadas = document.querySelector('.tarjetas-guardadas');
    const formTarjeta = document.querySelector('.form-tarjeta');
    
    if (tarjetasGuardadas) tarjetasGuardadas.style.display = 'none';
    if (formTarjeta) formTarjeta.style.display = 'block';
};

window.confirmarPago = function() {
    const metodoPago = document.querySelector('input[name="metodoPago"]:checked');
    if (!metodoPago) {
        alert('Por favor seleccione un método de pago');
        return;
    }

    // Validar según el método de pago
    if (metodoPago.value === 'tarjeta') {
        const tarjetaGuardada = document.querySelector('input[name="tarjetaGuardada"]:checked');
        const formTarjeta = document.querySelector('.form-tarjeta');
        
        if (!tarjetaGuardada && formTarjeta.style.display === 'block') {
            // Validar nueva tarjeta
            const inputs = formTarjeta.querySelectorAll('input[type="text"]');
            let isValid = true;
            inputs.forEach(input => {
                if (!input.value) {
                    isValid = false;
                }
            });
            if (!isValid) {
                alert('Por favor complete todos los campos de la tarjeta');
                return;
            }

            // Guardar tarjeta si está marcada la opción
            if (document.querySelector('#guardarTarjeta').checked) {
                const tarjetasGuardadas = JSON.parse(localStorage.getItem('tarjetasGuardadas')) || [];
                tarjetasGuardadas.push({
                    numero: inputs[0].value,
                    vencimiento: inputs[1].value,
                    nombre: inputs[3].value
                });
                localStorage.setItem('tarjetasGuardadas', JSON.stringify(tarjetasGuardadas));
            }
        }
    }

    const seguimientoPago = document.querySelector('.seguimiento-pago');
    const estadoPago = seguimientoPago.querySelector('.estado-pago');
    const estadoActual = seguimientoPago.querySelector('.estado-actual');
    const historialPago = seguimientoPago.querySelector('.historial-pago');

    // Ocultar selección de método de pago y mostrar estado
    seguimientoPago.querySelector('.metodos-pago').style.display = 'none';
    seguimientoPago.querySelector('.btn-confirmar-pago').style.display = 'none';
    estadoPago.style.display = 'block';

    // Mostrar estado inicial
    estadoActual.className = 'estado-pago pago-pendiente';
    estadoActual.textContent = 'Estado: Pendiente';
    historialPago.innerHTML = `
        <p>
            <span class="fecha">${new Date().toLocaleString()}</span>
            <br>
            Pago iniciado con ${metodoPago.value}
        </p>
    `;

    // Simular proceso de pago
    setTimeout(() => {
        estadoActual.className = 'estado-pago pago-procesando';
        estadoActual.textContent = 'Estado: Procesando';
        historialPago.innerHTML += `
            <p>
                <span class="fecha">${new Date().toLocaleString()}</span>
                <br>
                Procesando pago con ${metodoPago.value}
            </p>
        `;
    }, 2000);

    setTimeout(() => {
        estadoActual.className = 'estado-pago pago-completado';
        estadoActual.textContent = 'Estado: Completado';
        historialPago.innerHTML += `
            <p>
                <span class="fecha">${new Date().toLocaleString()}</span>
                <br>
                Pago completado exitosamente con ${metodoPago.value}
            </p>
        `;

        // Guardar el pedido
        const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
        const subtotal = carrito.reduce((sum, item) => sum + (parseFloat(item.precio) * item.cantidad), 0);
        const iva = subtotal * 0.16;
        const total = subtotal + iva;

        const pedido = {
            id: Date.now(),
            fecha: new Date().toISOString(),
            items: carrito,
            subtotal: subtotal,
            iva: iva,
            total: total,
            metodoPago: metodoPago.value,
            estado: 'completado'
        };

        const pedidosAnteriores = JSON.parse(localStorage.getItem('misPedidos')) || [];
        pedidosAnteriores.push(pedido);
        localStorage.setItem('misPedidos', JSON.stringify(pedidosAnteriores));

        // Limpiar carrito y redirigir
        setTimeout(() => {
            localStorage.removeItem('carrito');
            window.location.href = 'pedidos.html';
        }, 2000);
    }, 4000);
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
                <div class="carrito-vacio" style="padding: 100px 0;">
                    <i class="fas fa-shopping-cart" style="font-size: 120px; color: #ccc; margin-bottom: 30px;"></i>
                    <p style="font-size: 24px; margin: 20px 0;">Tu carrito está vacío</p>
                    <a href="categorias.html" class="btn" style="font-size: 20px; padding: 15px 40px; margin-top: 30px;">Ver pasteles</a>
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

    function mostrarNotificacion(mensaje) {
        const notif = document.createElement('div');
        notif.className = 'notification';
        notif.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #8B1538;
            color: white;
            padding: 15px 25px;
            border-radius: 5px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            z-index: 1000;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;
        notif.textContent = mensaje;
        document.body.appendChild(notif);

        setTimeout(() => notif.style.opacity = '1', 100);
        setTimeout(() => {
            notif.style.opacity = '0';
            setTimeout(() => notif.remove(), 300);
        }, 2000);
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
