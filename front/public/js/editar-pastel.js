document.addEventListener('DOMContentLoaded', function() {
    // Obtener el ID del pastel de la URL
    const urlParams = new URLSearchParams(window.location.search);
    const pastelId = urlParams.get('id_pastel');

    if (pastelId) {
        cargarDatosPastel(pastelId);
    }

    // Configurar el formulario
    const cakeForm = document.getElementById('cake-form');
    if (cakeForm) {
        cakeForm.addEventListener('submit', function(e) {
            e.preventDefault();
            guardarCambios(pastelId);
        });
    }
});

async function cargarDatosPastel(id) {
    try {
        const response = await fetch(`https://pateles-borcelle.onrender.com/api/pastel/obtenerpastel/${id}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const pastel = await response.json();

        // Llenar el formulario con los datos del pastel
        document.getElementById('size').value = pastel.tamaño || 'mediano';
        document.getElementById('flavor').value = pastel.sabor || 'chocolate';
        document.getElementById('decoration').value = pastel.decoracion || '';
        document.getElementById('message').value = pastel.mensaje || '';

        // Actualizar la imagen si existe
        const cakeImage = document.querySelector('.cake-image img');
        if (pastel.imagen_url) {
            cakeImage.src = pastel.imagen_url;
        }
    } catch (error) {
        console.error('Error al cargar los datos del pastel:', error);
        alert('Error al cargar los datos del pastel. Por favor, intenta nuevamente.');
    }
}

async function guardarCambios(id) {
    try {
        const datosActualizados = {
            tamaño: document.getElementById('size').value,
            sabor: document.getElementById('flavor').value,
            decoracion: document.getElementById('decoration').value,
            mensaje: document.getElementById('message').value
        };

        const response = await fetch(`https://pateles-borcelle.onrender.com/api/pastel/actpasteles/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datosActualizados)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        alert('Pastel actualizado exitosamente');
        window.location.href = 'categorias.html';
    } catch (error) {
        console.error('Error al guardar los cambios:', error);
        alert('Error al guardar los cambios. Por favor, intenta nuevamente.');
    }
}

async function eliminarPastel(id) {
    if (confirm('¿Estás seguro de que deseas eliminar este pastel?')) {
        try {
            const response = await fetch(`https://pateles-borcelle.onrender.com/api/pastel/elimpasteles/${id}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            alert('Pastel eliminado exitosamente');
            window.location.href = 'categorias.html';
        } catch (error) {
            console.error('Error al eliminar el pastel:', error);
            alert('Error al eliminar el pastel. Por favor, intenta nuevamente.');
        }
    }
}

// Función para agregar al carrito
function addToCart() {
    const pastel = {
        id: new URLSearchParams(window.location.search).get('id_pastel'),
        nombre: `Pastel ${document.getElementById('flavor').value}`,
        precio: calcularPrecio(),
        imagen_url: document.querySelector('.cake-image img').src,
        quantity: 1
    };

    // Obtener el carrito actual
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Verificar si el pastel ya existe en el carrito
    const existingItem = cart.find(item => item.id === pastel.id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        // Agregar el pastel al carrito
        cart.push(pastel);
    }
    
    // Guardar el carrito actualizado
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Actualizar el contador del carrito
    updateCartCount();
    
    // Mostrar notificación
    showNotification('Pastel agregado al carrito');
}

// Función para mostrar notificaciones
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Remover la notificación después de 3 segundos
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Función para actualizar el contador del carrito
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCount = document.querySelector('.cart-count');
    
    if (cartCount) {
        cartCount.textContent = totalItems;
        cartCount.style.display = totalItems > 0 ? 'block' : 'none';
    }
}

function calcularPrecio() {
    const tamaño = document.getElementById('size').value;
    const sabor = document.getElementById('flavor').value;
    let precioBase = 0;

    // Precio base según el tamaño
    switch(tamaño) {
        case 'pequeño':
            precioBase = 200;
            break;
        case 'mediano':
            precioBase = 350;
            break;
        case 'grande':
            precioBase = 500;
            break;
    }

    // Ajuste según el sabor
    switch(sabor) {
        case 'red velvet':
            precioBase += 50;
            break;
        case 'chocolate':
            precioBase += 30;
            break;
        case 'vainilla':
            precioBase += 20;
            break;
        case 'fresa':
            precioBase += 40;
            break;
    }

    return precioBase;
} 