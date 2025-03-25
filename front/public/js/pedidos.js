document.addEventListener('DOMContentLoaded', async function() {
    console.log('Iniciando carga de pedidos...'); // Para debugging
    
    const urlParams = new URLSearchParams(window.location.search);
    const esNuevoPedido = urlParams.get('new') === 'true';
    
    if (esNuevoPedido) {
        console.log('Detectado nuevo pedido'); // Para debugging
        const pedidoNuevoData = localStorage.getItem('ultimoPedidoCreado');
        console.log('Datos del nuevo pedido:', pedidoNuevoData); // Para debugging
        
        if (pedidoNuevoData) {
            const pedidoNuevo = JSON.parse(pedidoNuevoData);
            mostrarPedidoNuevo(pedidoNuevo);
        }
    }

    await cargarPedidos();
    agregarFiltros();

    setInterval(cargarPedidos, 30000);
});

function mostrarPedidoNuevo(pedido) {
    console.log('Mostrando pedido nuevo:', pedido); // Para debugging
    const pedidosActivos = document.getElementById('pedidosActivos');
    if (pedidosActivos) {
        const pedidoCard = crearPedidoCard(pedido);
        pedidoCard.classList.add('nuevo-pedido');
        pedidosActivos.innerHTML = '';
        pedidosActivos.appendChild(pedidoCard);
    }
}

async function cargarPedidos() {
    try {
        console.log('Cargando pedidos...'); // Para debugging
        const response = await fetch('http://localhost:3000/api/pedido/obtenerpedidos', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Cache-Control': 'no-cache'
            }
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(`Error en la respuesta: ${error}`);
        }

        const pedidos = await response.json();
        console.log('Pedidos obtenidos:', pedidos); // Para debugging

        window.todosPedidos = pedidos;
        mostrarPedidos(pedidos);
    } catch (error) {
        console.error('Error al cargar pedidos:', error);
    }
}

function mostrarPedidos(pedidos) {
    if (!pedidos || !Array.isArray(pedidos)) {
        console.log('No hay pedidos para mostrar');
        return;
    }
    
    const pedidosActivos = document.getElementById('pedidosActivos');
    const pedidosHistorial = document.getElementById('pedidosHistorial');
    
    if (!pedidosActivos || !pedidosHistorial) return;

    pedidosActivos.innerHTML = '';
    pedidosHistorial.innerHTML = '';

    console.log('Procesando pedidos:', pedidos.length); // Para debugging

    const pedidosSeparados = pedidos.reduce((acc, pedido) => {
        const estado = determinarEstado(pedido);
        console.log(`Pedido ${pedido.id_pedido} - Estado: ${estado}`); // Para debugging
        
        if (estado === 'pendiente' || estado === 'en-proceso') {
            acc.activos.push(pedido);
        } else {
            acc.historial.push(pedido);
        }
        return acc;
    }, { activos: [], historial: [] });

    if (pedidosSeparados.activos.length > 0) {
        pedidosSeparados.activos.forEach(pedido => {
            pedidosActivos.appendChild(crearPedidoCard(pedido));
        });
    } else {
        pedidosActivos.innerHTML = '<p>No hay pedidos activos</p>';
    }

    if (pedidosSeparados.historial.length > 0) {
        pedidosSeparados.historial.forEach(pedido => {
            pedidosHistorial.appendChild(crearPedidoCard(pedido));
        });
    } else {
        pedidosHistorial.innerHTML = '<p>No hay pedidos en el historial</p>';
    }
}

function crearPedidoCard(pedido) {
    const card = document.createElement('div');
    card.className = 'pedido-card';

    // Formatear fechas
    const fechaPedido = new Date(pedido.fecha_pedido).toLocaleDateString();
    const fechaEntrega = pedido.fecha_entrega ? new Date(pedido.fecha_entrega).toLocaleDateString() : 'Pendiente';
    
    // Determinar el estado
    const esPendiente = !pedido.fecha_entrega || new Date(pedido.fecha_entrega) > new Date();
    const estadoClase = esPendiente ? 'status-pendiente' : 'status-entregado';
    const estadoTexto = esPendiente ? 'Pendiente' : 'Entregado';

    card.innerHTML = `
        <h3>Pedido #${pedido.id_pedido}</h3>
        <div class="pedido-info">
            <p><strong>Fecha de Pedido:</strong> ${fechaPedido}</p>
            <p><strong>Fecha de Entrega:</strong> ${fechaEntrega}</p>
            <p><strong>Dirección:</strong> ${pedido.direccion}</p>
            <p><strong>Pastel:</strong> ${pedido.id_pastel}</p>
            <p><strong>Repostero:</strong> ${pedido.id_repostero}</p>
            <span class="pedido-status ${estadoClase}">${estadoTexto}</span>
        </div>
    `;

    return card;
}

// Función auxiliar para formatear precio
function formatearPrecio(precio) {
    return new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: 'MXN'
    }).format(precio);
}

// Opcional: Función para ver detalles del pedido
async function verDetallesPedido(pedidoId) {
    try {
        const response = await fetch(`http://localhost:3000/api/pedido/obtenerpedido/${pedidoId}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (!response.ok) {
            throw new Error('Error al obtener los detalles del pedido');
        }

        const pedido = await response.json();
        // Aquí podrías implementar un modal para mostrar más detalles
        console.log('Detalles del pedido:', pedido);
    } catch (error) {
        console.error('Error:', error);
        alert('Error al obtener los detalles del pedido');
    }
}

function calcularTotal(items) {
    return items.reduce((total, item) => total + (item.precio * item.quantity), 0);
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

function agregarFiltros() {
    const historialSection = document.querySelector('.pedidos-historial h2');
    historialSection.insertAdjacentHTML('afterend', `
        <div class="filtros-container">
            <div class="filtros-pedidos">
                <button class="filtro-btn active" data-estado="todos">Todos</button>
                <button class="filtro-btn" data-estado="entregado">Entregados</button>
                <button class="filtro-btn" data-estado="en-proceso">En Proceso</button>
                <button class="filtro-btn" data-estado="cancelado">Cancelados</button>
                <button class="filtro-btn" data-estado="pendiente">Pendientes</button>
            </div>
            <div class="filtros-fecha">
                <select id="tipoFecha" class="filtro-select">
                    <option value="todos">Todas las fechas</option>
                    <option value="dia">Por día</option>
                    <option value="mes">Por mes</option>
                    <option value="año">Por año</option>
                </select>
                <div id="contenedorFiltrosFecha" class="filtros-fecha-inputs" style="display: none;">
                    <input type="date" id="fechaInicio" class="filtro-fecha">
                    <input type="date" id="fechaFin" class="filtro-fecha">
                </div>
                <div id="contenedorFiltrosMes" class="filtros-fecha-inputs" style="display: none;">
                    <select id="mesFiltro" class="filtro-select">
                        ${generarOpcionesMeses()}
                    </select>
                    <select id="añoFiltro" class="filtro-select">
                        ${generarOpcionesAños()}
                    </select>
                </div>
            </div>
        </div>
    `);

    // Agregar estilos adicionales
    const estilos = `
        <style>
            .filtros-container {
                margin: 20px 0;
                display: flex;
                flex-direction: column;
                gap: 15px;
            }
            .filtros-pedidos {
                display: flex;
                gap: 10px;
                flex-wrap: wrap;
            }
            .filtro-btn {
                padding: 8px 16px;
                border: 2px solid #731D3C;
                background: white;
                color: #731D3C;
                border-radius: 20px;
                cursor: pointer;
                transition: all 0.3s ease;
            }
            .filtro-btn:hover, .filtro-btn.active {
                background: #731D3C;
                color: white;
            }
            .filtros-fecha {
                display: flex;
                gap: 10px;
                align-items: center;
                flex-wrap: wrap;
            }
            .filtro-select, .filtro-fecha {
                padding: 8px;
                border: 1px solid #731D3C;
                border-radius: 5px;
                color: #731D3C;
            }
            .filtros-fecha-inputs {
                display: flex;
                gap: 10px;
            }
        </style>
    `;
    document.head.insertAdjacentHTML('beforeend', estilos);

    configurarEventosFiltros();
}

function generarOpcionesMeses() {
    const meses = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    return meses.map((mes, index) => 
        `<option value="${index + 1}">${mes}</option>`
    ).join('');
}

function generarOpcionesAños() {
    const añoActual = new Date().getFullYear();
    const años = [];
    for (let i = añoActual - 2; i <= añoActual; i++) {
        años.push(`<option value="${i}">${i}</option>`);
    }
    return años.join('');
}

function configurarEventosFiltros() {
    const botonesFiltro = document.querySelectorAll('.filtro-btn');
    const tipoFecha = document.getElementById('tipoFecha');
    const contenedorFiltrosFecha = document.getElementById('contenedorFiltrosFecha');
    const contenedorFiltrosMes = document.getElementById('contenedorFiltrosMes');

    // Manejar clicks en botones de filtro
    botonesFiltro.forEach(btn => {
        btn.addEventListener('click', function() {
            botonesFiltro.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            aplicarFiltros(this.dataset.estado);
        });
    });

    // Manejar cambios en el tipo de fecha
    tipoFecha.addEventListener('change', function() {
        contenedorFiltrosFecha.style.display = 'none';
        contenedorFiltrosMes.style.display = 'none';

        if (this.value === 'dia') {
            contenedorFiltrosFecha.style.display = 'flex';
        } else if (this.value === 'mes' || this.value === 'año') {
            contenedorFiltrosMes.style.display = 'flex';
        }

        const estadoActual = document.querySelector('.filtro-btn.active').dataset.estado;
        aplicarFiltros(estadoActual);
    });

    // Manejar cambios en los inputs de fecha
    ['fechaInicio', 'fechaFin', 'mesFiltro', 'añoFiltro'].forEach(id => {
        const elemento = document.getElementById(id);
        if (elemento) {
            elemento.addEventListener('change', () => {
                const estadoActual = document.querySelector('.filtro-btn.active').dataset.estado;
                aplicarFiltros(estadoActual);
            });
        }
    });
}

function aplicarFiltros(estado) {
    if (!window.todosPedidos) return;

    let pedidosFiltrados = [...window.todosPedidos];

    // Aplicar filtro por estado
    if (estado !== 'todos') {
        pedidosFiltrados = pedidosFiltrados.filter(pedido => 
            determinarEstado(pedido) === estado
        );
    }

    // Mantener los filtros de fecha si están aplicados
    const tipoFecha = document.getElementById('tipoFecha').value;
    if (tipoFecha !== 'todos') {
        switch(tipoFecha) {
            case 'dia':
                pedidosFiltrados = filtrarPorRangoDeFechas(pedidosFiltrados);
                break;
            case 'mes':
                pedidosFiltrados = filtrarPorMesYAño(pedidosFiltrados);
                break;
            case 'año':
                pedidosFiltrados = filtrarPorAño(pedidosFiltrados);
                break;
        }
    }

    mostrarPedidos(pedidosFiltrados);
}

function filtrarPorRangoDeFechas(pedidos) {
    const fechaInicio = document.getElementById('fechaInicio').value;
    const fechaFin = document.getElementById('fechaFin').value;

    if (!fechaInicio || !fechaFin) return pedidos;

    const inicio = new Date(fechaInicio);
    const fin = new Date(fechaFin);
    fin.setHours(23, 59, 59);

    return pedidos.filter(pedido => {
        const fechaPedido = new Date(pedido.fecha_pedido);
        return fechaPedido >= inicio && fechaPedido <= fin;
    });
}

function filtrarPorMesYAño(pedidos) {
    const mes = parseInt(document.getElementById('mesFiltro').value);
    const año = parseInt(document.getElementById('añoFiltro').value);

    return pedidos.filter(pedido => {
        const fechaPedido = new Date(pedido.fecha_pedido);
        return fechaPedido.getMonth() + 1 === mes && 
               fechaPedido.getFullYear() === año;
    });
}

function filtrarPorAño(pedidos) {
    const año = parseInt(document.getElementById('añoFiltro').value);

    return pedidos.filter(pedido => {
        const fechaPedido = new Date(pedido.fecha_pedido);
        return fechaPedido.getFullYear() === año;
    });
}

function determinarEstado(pedido) {
    if (!pedido) return 'pendiente';
    
    if (pedido.estado === 'cancelado') return 'cancelado';
    if (!pedido.fecha_entrega) return 'pendiente';
    
    const fechaEntrega = new Date(pedido.fecha_entrega);
    const ahora = new Date();

    if (fechaEntrega > ahora) return 'en-proceso';
    return 'entregado';
}

// Agregar estilos para mejorar la experiencia visual
const estilosAdicionales = `
    <style>
        .pedido-card {
            opacity: 0;
            animation: fadeIn 0.3s ease forwards;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        .filtro-btn {
            transition: all 0.2s ease;
        }
        
        .filtro-btn:active {
            transform: scale(0.95);
        }
        
        @keyframes refreshing {
            0% { opacity: 1; }
            50% { opacity: 0.7; }
            100% { opacity: 1; }
        }
        
        .refreshing {
            animation: refreshing 0.5s ease;
        }
        
        .nuevo-pedido {
            animation: destacar 1s ease;
            border: 2px solid #731D3C !important;
            box-shadow: 0 0 15px rgba(115, 29, 60, 0.3) !important;
            background-color: #fff5f7 !important;
        }

        @keyframes destacar {
            0% { transform: scale(1); }
            50% { transform: scale(1.02); }
            100% { transform: scale(1); }
        }
    </style>
`;
document.head.insertAdjacentHTML('beforeend', estilosAdicionales);

// Función para mostrar efecto de actualización
function mostrarActualizacion() {
    const contenedor = document.querySelector('.pedidos-container');
    if (contenedor) {
        contenedor.classList.add('refreshing');
        setTimeout(() => {
            contenedor.classList.remove('refreshing');
        }, 500);
    }
} 