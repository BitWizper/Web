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
        
        // Agregar event listener para el formulario
        const form = document.getElementById('cake-form');
        if (form) {
            form.addEventListener('submit', async function(e) {
                e.preventDefault();
                await guardarCambios(pastelId);
            });
        }
    } else {
        console.error('No se encontraron datos del pastel');
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

// Función para guardar cambios
async function guardarCambios(pastelId) {
    try {
        const formData = {
            descripcion: document.getElementById('decoration').value,
            mensaje: document.getElementById('message').value,
            tamaño: document.getElementById('size').value,
            sabor: document.getElementById('flavor').value
        };

        const response = await fetch(`http://localhost:3000/api/pastel/actpasteles/${pastelId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        if (!response.ok) {
            throw new Error('Error al actualizar el pastel');
        }

        alert('Pastel actualizado correctamente');
        window.location.href = 'categorias.html';
    } catch (error) {
        console.error('Error:', error);
        alert('Error al guardar los cambios');
    }
}

// Función para eliminar pastel
async function eliminarPastel(pastelId) {
    if (confirm('¿Estás seguro de que deseas eliminar este pastel?')) {
        try {
            const response = await fetch(`http://localhost:3000/api/pastel/elimpasteles/${pastelId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Error al eliminar el pastel');
            }

            alert('Pastel eliminado correctamente');
            window.location.href = 'categorias.html';
        } catch (error) {
            console.error('Error:', error);
            alert('Error al eliminar el pastel');
        }
    }
}

// Nueva función para realizar pedido
async function realizarPedido() {
    try {
        const date = document.getElementById('date').value;
        const time = document.getElementById('time').value;

        if (!date || !time) {
            alert('Por favor selecciona fecha y hora de entrega');
            return;
        }

        // Obtener los datos del pastel del sessionStorage
        const pastelData = JSON.parse(sessionStorage.getItem('pastelEditar'));
        if (!pastelData) {
            alert('No se encontraron datos del pastel');
            return;
        }

        const fechaEntrega = `${date}T${time}:00`;

        const pedidoData = {
            id_pastel: pastelData.id_pastel,
            id_repostero: pastelData.id_repostero,
            fecha_entrega: fechaEntrega,
            direccion: "Por definir" // Podrías agregar un campo para esto en el HTML
        };

        const response = await fetch('http://localhost:3000/api/pedido/crearpedido', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(pedidoData)
        });

        if (!response.ok) {
            throw new Error('Error al crear el pedido');
        }

        const result = await response.json();
        alert('Pedido realizado correctamente');
        window.location.href = 'pedidos.html';
    } catch (error) {
        console.error('Error:', error);
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

// Reemplazar la función existente
function scheduleAppointment() {
    realizarPedido();
}
