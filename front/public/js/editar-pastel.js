document.addEventListener('DOMContentLoaded', async function() {
    // Obtener el ID del pastel de la URL
    const urlParams = new URLSearchParams(window.location.search);
    const pastelId = urlParams.get('id');
    
    // Obtener los datos del pastel guardados en sessionStorage
    const pastelData = JSON.parse(sessionStorage.getItem('pastelEditar'));
    
    if (pastelData) {
        // Actualizar la imagen del pastel
        const pastelImage = document.querySelector('.cake-image img');
        if (pastelImage) {
            pastelImage.src = pastelData.imagen_url || 'https://i.pinimg.com/736x/8d/4d/20/8d4d20b75a8d8b13e3d2907c5c58e633.jpg';
            pastelImage.alt = pastelData.nombre;
        }

        // Actualizar el título
        const titulo = document.querySelector('.cake-editor h1');
        if (titulo) {
            titulo.textContent = `Editor de Pastel: ${pastelData.nombre}`;
        }

        // Actualizar los campos del formulario
        document.getElementById('decoration').value = pastelData.descripcion || '';
        document.getElementById('message').value = pastelData.mensaje || '';
    }

    // Modificar el botón de "Realizar Pedido"
    const btnRealizarPedido = document.querySelector('button[onclick="window.location.href=\'pedidos.html\'"]');
    if (btnRealizarPedido) {
        btnRealizarPedido.onclick = function(e) {
            e.preventDefault();
            realizarPedido();
        };
    }

    // Modificar la función scheduleAppointment
    const btnAgendarCita = document.querySelector('button[onclick="scheduleAppointment()"]');
    if (btnAgendarCita) {
        btnAgendarCita.onclick = function(e) {
            e.preventDefault();
            realizarPedido();
        };
    }
});

async function realizarPedido() {
    try {
        const date = document.getElementById('date').value;
        const time = document.getElementById('time').value;
        const direccion = document.getElementById('direccion').value;

        if (!date || !time || !direccion) {
            alert('Por favor completa todos los campos: fecha, hora y dirección de entrega');
            return;
        }

        const pastelData = JSON.parse(sessionStorage.getItem('pastelEditar'));
        const token = localStorage.getItem('token');

        const fechaEntrega = `${date}T${time}:00`;
        const fechaPedido = new Date().toISOString();

        const pedidoData = {
            id_pastel: pastelData.id_pastel,
            id_repostero: pastelData.id_repostero,
            fecha_pedido: fechaPedido,
            fecha_entrega: fechaEntrega,
            direccion: direccion,
            estado: 'pendiente',
            detalles_pastel: {
                tamano: document.getElementById('size').value,
                sabor: document.getElementById('flavor').value,
                decoracion: document.getElementById('decoration').value,
                mensaje: document.getElementById('message').value
            }
        };

        console.log('Enviando pedido:', pedidoData);

        const response = await fetch('http://localhost:3000/api/pedido/crearpedido', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(pedidoData)
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(`Error al crear el pedido: ${error}`);
        }

        const resultado = await response.json();
        console.log('Respuesta del servidor:', resultado);

        // Guardar el pedido completo
        localStorage.setItem('ultimoPedidoCreado', JSON.stringify({
            ...pedidoData,
            id_pedido: resultado.id_pedido || resultado.insertId
        }));

        alert('¡Pedido realizado correctamente!');
        window.location.href = 'pedidos.html?new=true';
    } catch (error) {
        console.error('Error detallado:', error);
        alert('Error al realizar el pedido: ' + error.message);
    }
}

// Mantener las funciones existentes
function addToCart() {
    const size = document.getElementById('size').value;
    const flavor = document.getElementById('flavor').value;
    const decoration = document.getElementById('decoration').value;
    const message = document.getElementById('message').value;

    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');

    const item = document.createElement('div');
    item.innerHTML = `<p>Pastel ${flavor} ${size} con mensaje: "${message}" y decoración: "${decoration}"</p>`;
    cartItems.appendChild(item);

    let currentTotal = parseFloat(cartTotal.textContent || 0);
    cartTotal.textContent = (currentTotal + 1).toFixed(2);
    document.getElementById('cart-popup').style.display = 'block';
}

function scheduleAppointment() {
    realizarPedido();
}
