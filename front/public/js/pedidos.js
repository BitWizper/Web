document.addEventListener('DOMContentLoaded', function() {
    cargarPedidos();
});

async function cargarPedidos() {
    try {
        // Obtener el carrito actual
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        
        if (cart.length > 0) {
            // Crear un nuevo pedido con los items del carrito
            const nuevoPedido = {
                id: Date.now(),
                fecha: new Date().toLocaleDateString(),
                estado: 'pendiente',
                items: cart,
                total: calcularTotal(cart)
            };

            // Obtener pedidos existentes
            let pedidos = JSON.parse(localStorage.getItem('pedidos')) || [];
            
            // Agregar el nuevo pedido
            pedidos.push(nuevoPedido);
            
            // Guardar los pedidos actualizados
            localStorage.setItem('pedidos', JSON.stringify(pedidos));
            
            // Limpiar el carrito
            localStorage.setItem('cart', JSON.stringify([]));
            
            // Actualizar el contador del carrito
            updateCartCount();
        }

        // Mostrar los pedidos
        mostrarPedidos();
    } catch (error) {
        console.error('Error al cargar los pedidos:', error);
        alert('Error al cargar los pedidos. Por favor, intenta nuevamente.');
    }
}

function calcularTotal(items) {
    return items.reduce((total, item) => total + (item.precio * item.quantity), 0);
}

function mostrarPedidos() {
    const pedidos = JSON.parse(localStorage.getItem('pedidos')) || [];
    const pedidosActivos = document.getElementById('pedidosActivos');
    const pedidosHistorial = document.getElementById('pedidosHistorial');

    // Limpiar contenedores
    pedidosActivos.innerHTML = '';
    pedidosHistorial.innerHTML = '';

    // Ordenar pedidos por fecha (más recientes primero)
    pedidos.sort((a, b) => b.id - a.id);

    pedidos.forEach(pedido => {
        const pedidoCard = crearPedidoCard(pedido);
        
        if (pedido.estado === 'entregado' || pedido.estado === 'cancelado') {
            pedidosHistorial.appendChild(pedidoCard);
        } else {
            pedidosActivos.appendChild(pedidoCard);
        }
    });
}

function crearPedidoCard(pedido) {
    const card = document.createElement('div');
    card.className = 'pedido-card';

    const estadoClass = `estado-${pedido.estado}`;

    card.innerHTML = `
        <div class="pedido-header">
            <span class="pedido-id">#${pedido.id}</span>
            <span class="pedido-fecha">${pedido.fecha}</span>
            <span class="pedido-estado ${estadoClass}">${getEstadoTexto(pedido.estado)}</span>
        </div>
        
        <div class="pedido-items">
            ${pedido.items.map(item => `
                <div class="pedido-item">
                    <img src="${item.imagen_url}" alt="${item.nombre}">
                    <div class="item-details">
                        <div class="item-nombre">${item.nombre}</div>
                        <div class="item-cantidad">Cantidad: ${item.quantity}</div>
                        <div class="item-precio">$${(item.precio * item.quantity).toFixed(2)}</div>
                    </div>
                </div>
            `).join('')}
        </div>

        <div class="pedido-total">
            <span>Total:</span>
            <span>$${pedido.total.toFixed(2)}</span>
        </div>

        <div class="pedido-acciones">
            <button class="btn-ver-detalles" onclick="verDetallesPedido(${pedido.id})">
                Ver Detalles
            </button>
            ${pedido.estado === 'pendiente' ? `
                <button class="btn-cancelar" onclick="cancelarPedido(${pedido.id})">
                    Cancelar
                </button>
            ` : ''}
        </div>
    `;

    return card;
}

function getEstadoTexto(estado) {
    const estados = {
        'pendiente': 'Pendiente',
        'en-proceso': 'En Proceso',
        'entregado': 'Entregado',
        'cancelado': 'Cancelado'
    };
    return estados[estado] || estado;
}

function verDetallesPedido(pedidoId) {
    const pedidos = JSON.parse(localStorage.getItem('pedidos')) || [];
    const pedido = pedidos.find(p => p.id === pedidoId);

    if (pedido) {
        // Crear un modal con los detalles del pedido
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close">&times;</span>
                <h2>Detalles del Pedido #${pedido.id}</h2>
                <div class="pedido-detalles">
                    <p><strong>Fecha:</strong> ${pedido.fecha}</p>
                    <p><strong>Estado:</strong> ${getEstadoTexto(pedido.estado)}</p>
                    <div class="items-detalle">
                        ${pedido.items.map(item => `
                            <div class="item-detalle">
                                <img src="${item.imagen_url}" alt="${item.nombre}">
                                <div>
                                    <h3>${item.nombre}</h3>
                                    <p>Cantidad: ${item.quantity}</p>
                                    <p>Precio unitario: $${item.precio.toFixed(2)}</p>
                                    <p>Subtotal: $${(item.precio * item.quantity).toFixed(2)}</p>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                    <div class="total-detalle">
                        <h3>Total: $${pedido.total.toFixed(2)}</h3>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Cerrar modal
        const closeBtn = modal.querySelector('.close');
        closeBtn.onclick = function() {
            modal.remove();
        }

        window.onclick = function(event) {
            if (event.target == modal) {
                modal.remove();
            }
        }
    }
}

function cancelarPedido(pedidoId) {
    if (confirm('¿Estás seguro de que deseas cancelar este pedido?')) {
        const pedidos = JSON.parse(localStorage.getItem('pedidos')) || [];
        const pedidoIndex = pedidos.findIndex(p => p.id === pedidoId);

        if (pedidoIndex !== -1) {
            pedidos[pedidoIndex].estado = 'cancelado';
            localStorage.setItem('pedidos', JSON.stringify(pedidos));
            mostrarPedidos();
            alert('Pedido cancelado exitosamente');
        }
    }
}

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCount = document.querySelector('.cart-count');
    
    if (cartCount) {
        cartCount.textContent = totalItems;
        cartCount.style.display = totalItems > 0 ? 'block' : 'none';
    }
} 